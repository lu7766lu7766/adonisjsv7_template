# Middleware (中介軟體) 規範與範例

## 開發規範

- 註冊於 `start/kernel.ts`。
- **ApiFormatMiddleware**：攔截 API 請求，負責將 Controller 的回傳值或拋出的 Error 格式化為統一的 API JSON 格式，並將 HTTP Status Code 設為 200。
- **RoleMiddleware**：自 HTTP Context 中的 `auth` 取得使用者角色，判斷是否符合路由權限，若不符則拋出 `ApiException(CommonCodes.PERMISSION_DENIED)`。

---

## 程式碼範例 (`app/middleware/api_format_middleware.ts`)

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ApiFormatMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const start = Date.now()
    try {
      await next()
      // 成功回應統一包裝，HTTP Code 200
      return ctx.response.status(200).json({
        code: [0],
        data: ctx.response.lazyBody.content?.[0],
        time: `${Date.now() - start} ms`,
      })
    } catch (error) {
      // 異常回應統一包裝，HTTP Code 200，錯誤結構從 ExceptionHandler 拋出
      return ctx.response.status(200).json({
        ...error,
        time: `${Date.now() - start} ms`,
      })
    }
  }
}
```
