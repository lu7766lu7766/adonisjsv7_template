# Model (模型) 規範與範例

## 開發規範

- **命名策略**：必須設定 `public static namingStrategy = new SnakeCaseNamingStrategy()`，確保 JavaScript 的 camelCase 屬性在資料庫中對應為 snake_case。
- **額外欄位序列化**：設定 `public serializeExtras = true`。
- **欄位宣告**：使用 `declare` 宣告屬性，並掛載對應裝飾器（如 `@column({ isPrimary: true })`、`@column()`、`@column.dateTime({ autoCreate: true })`）。
- **計算屬性**：使用 `@computed()` 裝飾器定義唯讀屬性，變數名稱採用 `snake_case` (例如 `is_admin`)。
- **模型關聯**：使用 `@belongsTo`、`@hasMany` 等裝飾器，並宣告類型為 `BelongsTo<typeof TargetModel>`。
- **Model Hooks**：使用 `@beforeSave()` 或 `@beforeCreate()` 等生命週期 Hook。在 Hook 中存取資料庫時應使用 `model.$trx` 以確保處於同一個交易中。

---

## 程式碼範例 (`app/models/session.ts`)

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeSave, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Contract from './contract.js'
import User from './user.js'

export default class Session extends BaseModel {
  // 統一採用蛇形命名策略
  public static namingStrategy = new SnakeCaseNamingStrategy()
  
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contract_id: number | null

  @column()
  declare masseur_id: number

  @column.dateTime()
  declare massage_at: DateTime

  // 關聯宣告
  @belongsTo(() => Contract, { foreignKey: 'contract_id' })
  declare contract: BelongsTo<typeof Contract>

  @belongsTo(() => User, { foreignKey: 'masseur_id' })
  declare masseur: BelongsTo<typeof User>

  // Model Hook 處理，確保在同一個 Transaction 中
  @beforeSave()
  static async setPrice(session: Session) {
    if (!session.massage_at) {
      session.massage_at = DateTime.now()
    }
  }
}
```
