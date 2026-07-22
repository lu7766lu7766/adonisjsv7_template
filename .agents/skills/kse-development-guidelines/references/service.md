# Service (服務層) 規範與範例

## 開發規範

- **職責**：封裝商業邏輯與 Lucid ORM 的查詢。
- **查詢複用與非空值判斷**：當一個模組包含「清單 (list)」與「總數 (total)」查詢時，必須建立一個 `private xxx_where_builder(...)` 私有方法，傳回 Query Builder，讓 `list` 與 `total` 共同使用，避免重複撰寫相同的 where 條件。在判斷選填/非空參數是否存在時，**必須統一使用 `typeof variable != 'undefined'` 進行判斷**，以避免 boolean 值（例如 `false`）或數值（例如 `0`）被 `if (variable)` 語法誤判為空值而過濾。
- **交集型別 (Intersection Types)**：Service 方法的參數請善用 `app/interface/request.ts` 中定義的類型進行交叉約束，例如：`UpdateAdminValidator & withTransaction` 或 `GetAdminValidator & withPaginate`。
- **分頁與總數**：利用 ModelQueryBuilder 巨集，呼叫 `.pager(page, per_page)` 進行分頁，呼叫 `.total()` 取得總筆數。
- **交易套用**：在寫入或更新 Model 時，傳入 `{ client: trx }`。

---

## 程式碼範例 (`app/services/user.ts`)

```typescript
import { RoleEnum } from '#constants/role'
import User from '#models/user'
import { GetAdminValidator, CreateAdminValidator } from '#validators/user'
import { withPaginate, withTransaction } from '../interface/request.js'

export class UserService {
  // 1. 查詢邏輯複用
  private admin_where_builder({ role }: GetAdminValidator) {
    if (role) {
      return User.query().where('role', role)
    }
    return User.query().whereIn('role', [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN])
  }

  // 2. 利用交集型別定義參數
  admin_list({ role, page, per_page }: GetAdminValidator & withPaginate) {
    return this.admin_where_builder({ role })
      .pager(page, per_page) // 使用 ModelQueryBuilder 巨集
      .orderBy('created_at', 'desc')
  }

  admin_total({ role }: GetAdminValidator) {
    return this.admin_where_builder({ role }).total() // 使用 ModelQueryBuilder 巨集
  }

  admin_create({ trx, name, username, password, role }: withTransaction & CreateAdminValidator) {
    // 傳入 trx 實例
    return User.create({ name, username, password, role }, { client: trx })
  }
}
```
