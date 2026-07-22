# Router (路由) 規範與範例

## 開發規範

- **路由模組化**：所有的路由都宣告在 `start/routes.ts` 中，但應將不同模組的路由拆分至 `start/router/` 目錄下（例如：`admin.ts`, `super.ts`, `user.ts`, `inertia.ts`），並在 `routes.ts` 中以 `import './router/xxx.js'` 方式載入。
- **分組與前綴**：
  - API 路由必須以 `api` 作為 prefix。
  - 管理員 API 以 `api/admin` 作為 prefix，超級管理員以 `api/super` 作為 prefix。
- **命名 Middleware 的應用**：
  - 路由群組通常需綁定 `middleware.auth()` 作為身分驗證。
  - 管理端路由應加上 `middleware.role([RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN])` 進行權限限制。
  - API 路由必須綁定 `middleware.api_format()`，以統一回應的 JSON 格式。
- **Inertia 渲染路由**：直接在 `inertia.ts` 中以 `({ inertia }) => inertia.render('頁面名稱')` 進行頁面導航渲染。

---

## 程式碼範例 (`start/router/admin.ts`)

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
