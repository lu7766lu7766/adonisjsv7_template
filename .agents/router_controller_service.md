# Router & Controller & Service 範例

本文件提供 KSE 專案中路由定義、控制器依賴注入、服務層與資料庫交易（Transaction）整合之標準範例。

---

### 1. Router 模組化定義 (`start/router/admin.ts`)
```typescript
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { RoleEnum } from '#constants/role'
import UsersController from '#controllers/users_controller'

router
  .group(() => {
    router.get('', [UsersController, 'admin_list'])
    router.post('', [UsersController, 'admin_create'])
    router.put('', [UsersController, 'admin_update'])
  })
  .prefix('api/admin')
  .middleware([
    middleware.auth(),
    middleware.role([RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN]),
    middleware.api_format(),
  ])
```

### 2. Controller 依賴注入與交易處理 (`app/controllers/users_controller.ts`)
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
    // 使用 Class-based 巨集驗證
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

### 3. Service 查詢複用與交集型別 (`app/services/user.ts`)
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
