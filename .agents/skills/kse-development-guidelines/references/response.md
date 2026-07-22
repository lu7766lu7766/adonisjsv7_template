# Response (回應格式) & 錯誤碼機制規範

## 1. 統一 HTTP 200 設計

專案採用**統一回傳 HTTP 狀態碼 200** 的 API 設計，實際狀態透過 response body 中的 `code` 陣列區分：

- **成功回應**：
  ```json
  {
    "code": [0],
    "data": { ... },
    "time": "12 ms"
  }
  ```
- **失敗回應 (包含驗證錯誤)**：
  ```json
  {
    "code": [-10],
    "message": "per_page error",
    "time": "8 ms"
  }
  ```

---

## 2. 錯誤碼 (Error Code) 定義與存放規則

- **存放目錄**：所有 API 錯誤代碼皆統一存放在 `app/constants/api_codes/` 目錄下。
- **通用錯誤碼**：定義在 `common.ts` 中，使用 `CommonCodes` 類別管理（如 `OK = 0`, `ERROR = -1`, `PAGINATE_ERROR = -10`）。
- **模組錯誤碼**：模組專屬錯誤碼應獨立檔案存放，命名為 `模組名 + 專屬區間.ts`（例如 `user3000.ts`, `session2000.ts`）。
- **宣告風格**：成員必須使用 `static readonly` 宣告為整數。

---

## 3. 錯誤碼流轉機制 (Lifecycle)

```mermaid
graph TD
    A[Validator / ApiException] -->|以 String 傳遞錯誤代碼| B[HttpExceptionHandler]
    B -->|解析為 number[] 陣列並拋出| C[ApiFormatMiddleware]
    C -->|包裝為統一 JSON 格式, HTTP 200| D[前端 Axios Client]
```

1. **定義與綁定 (Validator / ApiException)**：Validator 中的錯誤訊息必須以 `.toString()` 傳給 `@validate`。
2. **攔截與轉換 (HttpExceptionHandler)**：將錯誤解析為 `{ code: number[], message }` 結構。
3. **格式化包裝 (ApiFormatMiddleware)**：統一 HTTP Status Code 為 200 並包裝 `code` 陣列。
4. **前端接收 (Axios Client)**：收到 200 後判斷 code，非 0 彈出 Alert 或處理轉址。
