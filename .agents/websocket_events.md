# WebSocket & Events 範例

本文件提供 KSE 專案中 Socket.io 掛載、防抖（Debounce）處理與手動 IoC 服務解析之標準範例。

---

### 1. Socket.io 掛載與防抖、IoC 手動解析 (`start/ws.ts`)
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
