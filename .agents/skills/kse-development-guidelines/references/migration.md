# Migration (資料庫遷移) 規範與範例

## 開發規範

- 繼承 `BaseSchema`，使用匿名導出 `export default class extends BaseSchema`。
- 資料表名稱設定為 `tableName` 屬性。
- 欄位命名必須採用 `snake_case`。
- 外鍵定義必須串接 `.references('id').inTable('其他資料表名稱')`，必要時以 `.comment('註解')` 補充欄位中文說明。
- 時間戳記統一使用 `table.timestamp('created_at')` 與 `table.timestamp('updated_at')`。

---

## 程式碼範例 (`database/migrations/xxx_users.ts`)

```typescript
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().comment('姓名')
      table.string('username').notNullable().unique().comment('帳號')
      table.string('password').notNullable().comment('密碼')
      table.integer('role').notNullable().comment('角色 Enum')
      
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```
