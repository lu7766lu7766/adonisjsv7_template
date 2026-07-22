# Validator (驗證器) 規範與範例

## ⚖️ 最高憲法原則

- **所有接收 Request 參數必須經過 `validateClass`**：
  在 Controller 或 Route Handler 中，讀取前端傳來的任何 Query、Body 或 Params 參數，**必須 100% 透過 `await request.validateClass(ValidatorClass)` 進行驗證**。嚴禁使用 `request.input()` / `request.qs()` 等繞過驗證。

---

## 開發規範

- **Class-based 驗證**：本專案採用自訂的 Class-based 驗證機制。透過裝飾器將 VineJS 的 schema 與錯誤訊息綁定於 Class 屬性上。
- **驗證裝飾器**：使用 `@validate(vineSchema, errorMessages)`。
  - 欄位必須使用 `declare` 宣告，以避免 TypeScript 在編譯時初始化預設值而覆蓋裝飾器屬性。
  - 錯誤訊息必須對應 `CommonCodes` 的代碼，並使用 `.toString()` 傳遞給裝飾器。
- **自訂驗證規則**：若需自訂驗證，可使用 `vine.createRule` 建立規則，例如：`within` 日期區間驗證。

---

## 程式碼範例 (`app/validators/common.ts`)

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
