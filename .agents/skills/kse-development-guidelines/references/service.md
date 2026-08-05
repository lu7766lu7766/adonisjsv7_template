# Service (服務層) 規範與範例

## 開發規範

- **職責**：封裝商業邏輯與 Lucid ORM 的查詢。
- **標準 CRUD 方法**：服務層模組大部分情況下包含 `list`（取得列表）、`create`（新增）、`update`（更新）、`delete`（刪除）等基本方法；**`total`（取得總筆數）方法僅在有分頁需求時才需要**，實際可依具體業務需求調整。
- **`list` & `total` 共用 `where_builder`**：當有分頁需求且模組同時包含「清單 (list)」與「總數 (total)」查詢時，應建立一個 `private xxx_where_builder(...)` 私有方法傳回 Query Builder，讓 `list` 與 `total` 共用查詢條件。在判斷選填/非空參數是否存在時，**必須統一使用 `typeof variable != 'undefined'` 進行判斷**，以避免 boolean 值（例如 `false`）或數值（例如 `0`）被 `if (variable)` 語法誤判為空值而過濾。
- **交集型別 (Intersection Types)**：Service 方法的參數請善用 `app/interface/request.ts` 中定義的類型進行交叉約束，例如：`UpdateAdminValidator & withTransaction` 或 `GetAdminValidator & withPaginate`。
- **分頁與總數**：若有分頁需求，利用 ModelQueryBuilder 巨集呼叫 `.pager(page, per_page)` 進行分頁，並透過 `.total()` 取得總筆數。
- **交易套用**：在寫入或更新 Model 時，傳入 `{ client: trx }`。
- **密碼寫入**：`User.create()` 或建立使用者時，`User` 模型會自動將 `password` 進行 Hash 加密，Service 層寫入或傳入原始明文密碼即可，**不需要手動加密**。

---

## 程式碼範例 (`app/services/user.ts`)

```typescript
import { RoleEnum } from '#constants/role'
import User from '#models/user'
import { GetAdminValidator, CreateAdminValidator, UpdateAdminValidator } from '#validators/user'
import { withPaginate, withTransaction } from '../interface/request.js'

export class UserService {
  // 1. list & total 共用的私有 where_builder (有分頁與 total 需求時)
  private admin_where_builder({ role }: GetAdminValidator) {
    if (typeof role !== 'undefined') {
      return User.query().where('role', role)
    }
    return User.query().whereIn('role', [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN])
  }

  // 2. list (取得列表)
  admin_list({ role, page, per_page }: GetAdminValidator & withPaginate) {
    return this.admin_where_builder({ role })
      .pager(page, per_page) // 使用 ModelQueryBuilder 巨集
      .orderBy('created_at', 'desc')
  }

  // 3. total (取得總筆數 - 僅在有分頁需求時才需要)
  admin_total({ role }: GetAdminValidator) {
    return this.admin_where_builder({ role }).total() // 使用 ModelQueryBuilder 巨集
  }

  // 4. create (新增) - User 模型會自動加密 password
  admin_create({ trx, name, username, password, role }: withTransaction & CreateAdminValidator) {
    return User.create({ name, username, password, role }, { client: trx })
  }

  // 5. update (更新)
  async admin_update({ id, trx, ...data }: withTransaction & UpdateAdminValidator & { id: number }) {
    const user = await User.findOrFail(id, { client: trx })
    user.merge(data)
    await user.save()
    return user
  }

  // 6. delete (刪除)
  async admin_delete({ id, trx }: withTransaction & { id: number }) {
    const user = await User.findOrFail(id, { client: trx })
    await user.delete()
    return true
  }
}
```
