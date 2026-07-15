# Validator & Model 範例

本文件提供 KSE 專案中 Class-based Validator 宣告、Lucid Model、關聯與 Hook 交易處理之標準範例。

---

### 1. Class-based Validator 宣告 (`app/validators/common.ts`)
```typescript
import { CommonCodes } from '#constants/api_codes/common'
import { validate } from '#start/makcros/class_validator_macros'
import vine from '@vinejs/vine'

export class PaginateValidator {
  // 用 declare 宣告，利用 @validate 裝飾器綁定 VineJS schema
  @validate(vine.number(), {
    number: CommonCodes.PAGINATE_ERROR.toString(),
    required: CommonCodes.PAGINATE_ERROR.toString(),
  })
  declare per_page: number

  @validate(vine.number(), {
    number: CommonCodes.PAGINATE_ERROR.toString(),
    required: CommonCodes.PAGINATE_ERROR.toString(),
  })
  declare page: number
}
```

### 2. Model 定義與 Hook 交易處理 (`app/models/session.ts`)
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
