# Exception & Response & Middleware 範例

本文件提供 KSE 專案中自訂 ApiException、統一 API 格式化中介軟體之標準範例。

---

### 1. 自訂 ApiException (`app/exceptions/api_exception.ts`)
```typescript
import { Exception } from '@adonisjs/core/exceptions'

export class ApiException extends Exception {
  constructor(status: number, message = 'false') {
    super(message, { status, code: 'API_EXCEPTION' })
  }
}
```

### 2. 異常攔截與錯誤碼解析處理器 (`app/exceptions/handler.ts`)
```typescript
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { CommonCodes } from '#constants/api_codes/common'

export default class HttpExceptionHandler extends ExceptionHandler {
  async handle(error: any, ctx: HttpContext) {
    let code, message = error.message

    // 1. 攔截驗證錯誤，將 Validator 的 string 代碼轉換為數字陣列
    if (error.code == 'E_VALIDATION_ERROR') {
      const numbers = error.messages.filter(
        (x: { message: string }) => !isNaN(parseFloat(x.message))
      )
      const messages = error.messages.filter((x: { message: string }) =>
        isNaN(parseFloat(x.message))
      )

      code = numbers.length
        ? numbers.map((x: { message: string }) => +x.message)
        : [CommonCodes.VALIDATOR_MESSAGE_NOT_DEFINED]
      message = messages.length ? messages : false
      
      // 拋出結構，將被 ApiFormatMiddleware 捕獲並包裝
      throw { code, message }
    } 
    
    // 2. 攔截自訂 ApiException 錯誤
    else if (error.name === 'ApiException') {
      code = [error.status]
      message = error.message
    } 
    
    // 3. 其他非預期系統錯誤
    else {
      code = [CommonCodes.ERROR]
      message = `System error, please call the management!! ${error.message}`
    }

    throw { code, message }
  }
}
```

### 3. 統一格式化 Response Middleware (`app/middleware/api_format_middleware.ts`)
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
