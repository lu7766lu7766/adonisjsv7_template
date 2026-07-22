# Exception (異常處理) 規範與範例

## 開發規範

- **自訂 ApiException**：當業務邏輯出錯或無權限時，丟出 `new ApiException(status_code, message)`。
- **全域 HttpExceptionHandler**：定義在 `app/exceptions/handler.ts`。它會：
  - 攔截 `E_VALIDATION_ERROR` (驗證錯誤)，提取自訂的驗證錯誤碼，並將其組織為 `code` 陣列後重新拋出 `{ code, message }`。
  - 將 `ApiException` 轉換為 API 標準錯誤格式。
  - 針對 404 及 500 等錯誤，若為一般網頁請求，則利用 `inertia.render` 指向錯誤頁面。

---

## 程式碼範例

### 1. 自訂 ApiException (`app/exceptions/api_exception.ts`)

```typescript
import { Exception } from '@adonisjs/core/exceptions'

export class ApiException extends Exception {
  constructor(status: number, message = 'false') {
    super(message, { status, code: 'API_EXCEPTION' })
  }
}
```

### 2. 異常攔截處理器 (`app/exceptions/handler.ts`)

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
