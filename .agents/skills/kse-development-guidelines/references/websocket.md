# WebSocket (WS) 規範與範例

## 開發規範

- 整合 `socket.io`，服務定義於 `start/ws.ts`。
- 透過 `adonisServer.getNodeServer()` 將 Socket.io 掛載在 HTTP 伺服器上。
- **防抖機制 (Debounce)**：使用 Server 端的 Map (如 `dedupeMap`) 限制同一個使用者的請求頻率（如限制 3 秒內不得重複發送請求）。
- **服務解析**：在 WS 事件中無法自動依賴注入，必須手動透過 `await app.container.make(SessionService)` 解析服務。
- **驗證**：手動使用 `@vinejs/vine` 的 `vine.validate({ schema, data })` 進行資料驗證。
- **資料庫交易**：WS 事件中若有寫入操作，亦需使用 `db.transaction()` 並回傳給 client 端。

---

## 程式碼範例 (`start/ws.ts`)

```typescript
import adonisServer from '@adonisjs/core/services/server'
import { Server, Socket } from 'socket.io'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { SessionService } from '#services/session'

// Server 端防抖 (以使用者 ID 作為 Key)
const dedupeMap = new Map<number, number>()
const DEBOUNCE_INTERVAL = 3000

class WsServer {
  constructor() {
    const io = new Server(adonisServer.getNodeServer(), {
      cors: { origin: '*' },
    })
    io.on('connection', (socket) => {
      new Connection(io, socket).listener()
    })
  }
}

class Connection {
  constructor(private io: Server, private socket: Socket) {}

  listener() {
    this.socket.on('deduct_session', (data) => this.deduct_session(data))
  }

  private async deduct_session({ auth_id, user_id, count }) {
    // 1. 防抖檢查
    const now = Date.now()
    const lastTime = dedupeMap.get(auth_id)
    if (lastTime && now - lastTime < DEBOUNCE_INTERVAL) {
      return this.socket.emit('debunce_error', '請求過於頻繁，請稍後再試')
    }
    dedupeMap.set(auth_id, now)

    // 2. 手動解析 IoC Container 中的 Service
    const sessionService = await app.container.make(SessionService)

    try {
      // 3. 手動資料驗證
      await vine.validate({
        schema: vine.object({
          auth_id: vine.number(),
          user_id: vine.number(),
          count: vine.number(),
        }),
        data: { auth_id, user_id, count }
      })

      // 4. 資料庫交易包裝
      const res = await db.transaction((trx) =>
        sessionService.create({ trx, masseur_id: auth_id, user_id, count })
      )

      this.io.to(this.socket.id).emit('deducted', res)
    } catch (e) {
      this.socket.emit('error', e)
    }
  }
}

new WsServer()
```
