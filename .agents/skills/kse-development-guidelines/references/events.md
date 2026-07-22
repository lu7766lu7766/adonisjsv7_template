# Events (事件系統) 規範與範例

## 開發規範

- 定義於 `start/events.ts`。
- 可以使用 `emitter.on('db:query', (query) => { ... })` 監聽系統事件，並輸出執行效能與 SQL 語句。

---

## 程式碼範例 (`start/events.ts`)

```typescript
import emitter from '@adonisjs/core/services/emitter'

emitter.on('db:query', (query) => {
  console.log(`[SQL Log] (${query.duration}ms) ${query.sql}`)
})
```
