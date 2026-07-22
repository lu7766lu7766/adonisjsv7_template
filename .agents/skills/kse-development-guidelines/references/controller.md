# Controller (控制器) 規範與範例

## 開發規範

- **依賴注入**：Controller 類別上方必須加上 `@inject()` 裝飾器，並在 `constructor` 中以 `private` 參數注入所需的 Service（例如：`private service: UserService`）。
- **引數結構**：方法接收 `HttpContext` 物件作為參數。解構時通常取出 `{ request }`、`{ response }` 或 `{ auth }`。
- **資料驗證 (最高憲法)**：在 Controller 或 Route Handler 中，**接收任何參數必須統一使用 `const validatedData = await request.validateClass(ValidatorClassName)` 進行 Class-based 資料驗證**。嚴禁使用 `request.input()` / `request.all()` 等未經驗證的方法。
- **資料庫交易 (Transaction)**：若 Controller 的操作涉及寫入、更新或刪除，必須使用 `db.transaction(async (trx) => { ... })` 包裝，並將 `trx` 傳遞給 Service 層，以確保資料的一致性。
- **回傳值**：Controller 方法直接 `return` 資料物件或陣列。`ApiFormatMiddleware` 會自動攔截並將其轉換成 `{ code: [0], data: returnVal, time: "X ms" }` 格式回傳，無須手動封裝 JSON。

---

## 程式碼範例 (`app/controllers/users_controller.ts`)

```typescript
import { UserService } from '#services/user'
import { PaginateValidator } from '#validators/common'
import { CreateAdminValidator, GetAdminValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class UsersController {
  // 自動解析依賴注入
  constructor(private service: UserService) {}

  async admin_list({ request }: HttpContext) {
    // 使用 Class-based 巨集驗證 (最高憲法)
    const { role } = await request.validateClass(GetAdminValidator)
    const { page, per_page } = await request.validateClass(PaginateValidator)
    return this.service.admin_list({ role, page, per_page })
  }

  async admin_create({ request }: HttpContext) {
    const data = await request.validateClass(CreateAdminValidator)
    
    // 使用 db.transaction 進行資料庫交易
    return db.transaction((trx) =>
      this.service.admin_create({ trx, ...data })
    )
  }
}
```
