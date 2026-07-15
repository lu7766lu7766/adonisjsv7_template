# KSE 專案開發規範手冊

本手冊旨在為開發人員與 AI Agent 提供 KSE 專案的架構設計、命名規範與程式碼撰寫風格說明，以維持專案代碼的一致性。

---

## 範例文件導覽

為方便聚焦與快速參考，程式碼範例已拆分為多個獨立檔案：

- **Router & Controller & Service 範例** ➡️ [router_controller_service.md](./.agents/router_controller_service.md)
- **Validator & Model 範例** ➡️ [validator_model.md](./.agents/validator_model.md)
- **Exception & Response & Middleware 範例** ➡️ [exception_middleware_response.md](./.agents/exception_middleware_response.md)
- **WebSocket & Events 範例** ➡️ [websocket_events.md](./.agents/websocket_events.md)
- **Vue (Pug + script setup + Hooks) 範例** ➡️ [vue.md](./.agents/vue.md)

---

## 1. 專案技術棧概覽

- **後端框架**：AdonisJS v7 (採用 TypeScript ES Modules)
- **前端框架**：Vue 3 (Composition API / `<script setup>`) + Inertia.js (v2)
- **模板引擎**：Pug (`lang="pug"`)
- **樣式庫**：Tailwind CSS + Vant UI (行動端元件庫)
- **資料庫 ORM**：Lucid ORM (MySQL 2)
- **資料驗證**：VineJS

---

## 2. 目錄與路徑別名 (Imports)

專案在 `package.json` 的 `imports` 中定義了多個路徑別名，開發時請務必使用這些別名進行模組載入（避免相對路徑深淵）：

- `#controllers/*` ➡️ `./app/controllers/*.js`
- `#exceptions/*` ➡️ `./app/exceptions/*.js`
- `#constants/*` ➡️ `./app/constants/*.js`
- `#utils/*` ➡️ `./app/utils/*.js`
- `#models/*` ➡️ `./app/models/*.js`
- `#services/*` ➡️ `./app/services/*.js`
- `#middleware/*` ➡️ `./app/middleware/*.js`
- `#validators/*` ➡️ `./app/validators/*.js`
- `#start/*` ➡️ `./start/*.js`
- `#config/*` ➡️ `./config/*.js`

---

## 3. 各層級開發規範

### 3.1 Router (路由)

> 💡 實作範例請參考：[router_controller_service.md](./.agents/router_controller_service.md#1-router-模組化定義-startrouteradmints)

- **路由模組化**：所有的路由都宣告在 `start/routes.ts` 中，但應將不同模組的路由拆分至 `start/router/` 目錄下（例如：`admin.ts`, `super.ts`, `user.ts`, `inertia.ts`），並在 `routes.ts` 中以 `import './router/xxx.js'` 方式載入。
- **分組與前綴**：
  - API 路由必須以 `api` 作為 prefix。
  - 管理員 API 以 `api/admin` 作為 prefix，超級管理員以 `api/super` 作為 prefix。
- **命名 Middleware 的應用**：
  - 路由群組通常需綁定 `middleware.auth()` 作為身分驗證。
  - 管理端路由應加上 `middleware.role([RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN])` 進行權限限制。
  - API 路由必須綁定 `middleware.api_format()`，以統一回應的 JSON 格式。
- **Inertia 渲染路由**：直接在 `inertia.ts` 中以 `({ inertia }) => inertia.render('頁面名稱')` 進行頁面導航渲染。

### 3.2 Controller (控制器)

> 💡 實作範例請參考：[router_controller_service.md](./.agents/router_controller_service.md#2-controller-依賴注入與交易處理-appcontrollersusers_controllerts)

- **依賴注入**：Controller 類別上方必須加上 `@inject()` 裝飾器，並在 `constructor` 中以 `private` 參數注入所需的 Service（例如：`private service: UserService`）。
- **引數結構**：方法接收 `HttpContext` 物件作為參數。解構時通常取出 `{ request }`、`{ response }` 或 `{ auth }`。
- **資料驗證**：在 Controller 中，統一使用 `const validatedData = await request.validateClass(ValidatorClassName)` 進行請求資料的驗證。
- **資料庫交易 (Transaction)**：若 Controller 的操作涉及寫入、更新或刪除，必須使用 `db.transaction(async (trx) => { ... })` 包裝，並將 `trx` 傳遞給 Service 層，以確保資料的一致性。
- **回傳值**：Controller 方法直接 `return` 資料物件或陣列。`ApiFormatMiddleware` 會自動攔截並將其轉換成 `{ code: [0], data: returnVal, time: "X ms" }` 格式回傳，無須手動封裝 JSON。

### 3.3 Validators (驗證器)

> 💡 實作範例請參考：[validator_model.md](./.agents/validator_model.md#1-class-based-validator-宣告-appvalidatorscommonts)

- **Class-based 驗證**：本專案採用自訂的 Class-based 驗證機制。透過裝飾器將 VineJS 的 schema 與錯誤訊息綁定於 Class 屬性上。
- **驗證裝飾器**：使用 `@validate(vineSchema, errorMessages)`。
  - 欄位必須使用 `declare` 宣告，以避免 TypeScript 在編譯時初始化預設值而覆蓋裝飾器屬性。
  - 錯誤訊息必須對應 `CommonCodes` 的代碼，並使用 `.toString()` 傳遞給裝飾器。
- **自訂驗證規則**：若需自訂驗證，可使用 `vine.createRule` 建立規則，例如：`within` 日期區間驗證。

### 3.4 Service (服務層)

> 💡 實作範例請參考：[router_controller_service.md](./.agents/router_controller_service.md#3-service-查詢複用與交集型別-appservicesuserts)

- **職責**：封裝商業邏輯與 Lucid ORM 的查詢。
- **查詢複用與非空值判斷**：當一個模組包含「清單 (list)」與「總數 (total)」查詢時，必須建立一個 `private xxx_where_builder(...)` 私有方法，傳回 Query Builder，讓 `list` 與 `total` 共同使用，避免重複撰寫相同的 where 條件。在判斷選填/非空參數是否存在時，**必須統一使用 `typeof variable != 'undefined'` 進行判斷**，以避免 boolean 值（例如 `false`）或數值（例如 `0`）被 `if (variable)` 語法誤判為空值而過濾。
- **交集型別 (Intersection Types)**：Service 方法的參數請善用 `app/interface/request.ts` 中定義的類型進行交叉約束，例如：`UpdateAdminValidator & withTransaction` 或 `GetAdminValidator & withPaginate`。
- **分頁與總數**：利用 ModelQueryBuilder 巨集，呼叫 `.pager(page, per_page)` 進行分頁，呼叫 `.total()` 取得總筆數。
- **交易套用**：在寫入或更新 Model 時，傳入 `{ client: trx }`。

### 3.5 Inject (依賴注入)

> 💡 實作範例請參考：[router_controller_service.md](./.agents/router_controller_service.md) 以及 [websocket_events.md](./.agents/websocket_events.md) 的服務解析部分

- AdonisJS v7 使用 IoC Container 管理依賴。
- 只要類別需要自動解析依賴（如 Controller 需要 Service），就必須在其 class 宣告上方掛上 `@inject()`。
- 非 HTTP 請求流程中（如 WebSocket 的事件處理器），若需要 Service，必須手動使用 `await app.container.make(ServiceClass)` 從 IoC 容器中解析實例。

### 3.6 Seeder (種子資料)

- 繼承 `BaseSeeder`，使用匿名導出 `export default class extends BaseSeeder`。
- `run()` 中的所有資料庫寫入操作應以 `db.transaction(async (trx) => { ... })` 進行，並在 `createMany` 等寫入方法中傳入 `{ client: trx }`。
- 分為 `dev` 與 `prod` Seeders，可使用 `package.json` 中的 `seed:dev` 或 `seed:prod` 執行。

### 3.7 Migration (遷移)

- 繼承 `BaseSchema`，使用匿名導出 `export default class extends BaseSchema`。
- 資料表名稱設定為 `tableName` 屬性。
- 欄位命名必須採用 `snake_case`。
- 外鍵定義必須串接 `.references('id').inTable('其他資料表名稱')`，必要時以 `.comment('註解')` 補充欄位中文說明。
- 時間戳記統一使用 `table.timestamp('created_at')` 與 `table.timestamp('updated_at')`。

### 3.8 Exception (異常處理)

> 💡 實作範例請參考：[exception_middleware_response.md](./.agents/exception_middleware_response.md#1-自訂-apiexception-appexceptionsapi_exceptionts)

- **自訂 ApiException**：當業務邏輯出錯或無權限時，丟出 `new ApiException(status_code, message)`。
- **全域 HttpExceptionHandler**：定義在 `app/exceptions/handler.ts`。它會：
  - 攔截 `E_VALIDATION_ERROR` (驗證錯誤)，提取自訂的驗證錯誤碼，並將其組織為 `code` 陣列後重新拋出 `{ code, message }`。
  - 將 `ApiException` 轉換為 API 標準錯誤格式。
  - 針對 404 及 500 等錯誤，若為一般網頁請求，則利用 `inertia.render` 指向錯誤頁面。

### 3.9 Model (模型)

> 💡 實作範例請參考：[validator_model.md](./.agents/validator_model.md#2-model-定義與-hook-交易處理-appmodelssessionts)

- **命名策略**：必須設定 `public static namingStrategy = new SnakeCaseNamingStrategy()`，確保 JavaScript 的 camelCase 屬性在資料庫中對應為 snake_case。
- **額外欄位序列化**：設定 `public serializeExtras = true`。
- **欄位宣告**：使用 `declare` 宣告屬性，並掛載對應裝飾器（如 `@column({ isPrimary: true })`、`@column()`、`@column.dateTime({ autoCreate: true })`）。
- **計算屬性**：使用 `@computed()` 裝飾器定義唯讀屬性，變數名稱採用 `snake_case` (例如 `is_admin`)。
- **模型關聯**：使用 `@belongsTo`、`@hasMany` 等裝飾器，並宣告類型為 `BelongsTo<typeof TargetModel>`。
- **Model Hooks**：使用 `@beforeSave()` 或 `@beforeCreate()` 等生命週期 Hook。在 Hook 中存取資料庫時應使用 `model.$trx` 以確保處於同一個交易中。

### 3.10 Constants & Enum (常數與列舉)

- **角色定義**：
  - 定義 `RoleEnum` (為 Enum) 做為資料庫存取的值。
  - 同時定義 `RoleConstants` (為 Class) 做為工具類別，提供 `options()`、`enum()` 陣列及靜態判斷方法（如 `isAdmin(role)`）。
- **API 錯誤代碼**：
  - 統一存放在 `app/constants/api_codes/` 底下。
  - `CommonCodes` 儲存系統通用錯誤代碼，模組特定代碼依模組名稱分類（如 `user3000.ts`, `session2000.ts` 等），代碼以 Class 的 `static readonly` 宣告。

### 3.11 Inertia

- 後端使用 `inertia.render('PageName', { props })` 來回傳 Vue 頁面。
- 前端頁面元件位於 `inertia/pages/` 底下。

### 3.12 Vue 風格

> 💡 實作範例請參考：[vue.md](./.agents/vue.md#1-前端-crud-頁面-inertiapagesadminvue)

- **Pug 模板**：`<template lang="pug">`，使用縮排結構，Class 定義寫法為 `div(class="...")`。
- **TypeScript 腳本**：`<script setup lang="ts">`。
- **元件命名**：自訂元件與排版元件使用 PascalCase (如 `Layout`, `DataTable`, `Pagination`, `Model`)。
- **UI 元件庫**：表單與互動按鈕使用 Vant 提供的元件 (如 `Field`, `Button`, `RadioGroup`, `Radio`)。
- **自訂 Hooks (Composition API)**：
  - 統一使用自訂的 `useList(useApi("模組"), searchForm)` 來處理清單 CRUD、分頁、搜尋重新整理、編輯與刪除彈窗狀態。
  - `useApi("模組")` 為 API 工廠方法，取得對應模組的 Axios 請求函數。
- **API 請求與認證**：
  - 前端透過自訂的 `request(url, method, data)` 發送 Axios 請求，其會自動在 Header 帶入 `Authorization: Bearer ${token}`。
  - 請求成功且 response code 包含 0 時，回傳 data。若 code 包含 401 則利用 Inertia `router.visit("/login")` 跳轉。其餘 code 則丟出 Error 並 alert 錯誤訊息。

### 3.13 Middleware (中介軟體)

- 註冊於 `start/kernel.ts`。
- **ApiFormatMiddleware**：攔截 API 請求，負責將 Controller 的回傳值或拋出的 Error 格式化為統一的 API JSON 格式，並將 HTTP Status Code 設為 200。
- **RoleMiddleware**：自 HTTP Context 中的 `auth` 取得使用者角色，判斷是否符合路由權限，若不符則拋出 `ApiException(CommonCodes.PERMISSION_DENIED)`。

### 3.14 Response (回應格式) & 錯誤碼定義機制

> 💡 實作範例請參考：[exception_middleware_response.md](./.agents/exception_middleware_response.md)

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

#### 3.14.1 錯誤碼（Error Code）定義與存放位置

- **存放目錄**：所有 API 錯誤代碼皆統一存放在 `app/constants/api_codes/` 目錄下。
- **通用錯誤碼**：定義在 `common.ts` 中，使用 `CommonCodes` 類別管理，包括系統通用代碼（如 `OK = 0`, `ERROR = -1`, `PAGINATE_ERROR = -10`）。
- **模組錯誤碼**：模組專屬的錯誤碼應獨立檔案存放，命名規則為 `模組名 + 專屬區間.ts`。例如：
  - `user3000.ts`：定義 user 模組錯誤碼，數值區間為 `3000 ~ 3999`。
  - `session2000.ts`：定義 session 模組錯誤碼，數值區間為 `2000 ~ 2999`。
- **宣告風格**：錯誤代碼類別中的成員必須使用 `static readonly` 宣告為**負整數**（通用）或**正整數**（模組專屬）。例如：
  ```typescript
  export class CommonCodes {
    static readonly PAGINATE_ERROR = -10
  }
  ```

---

#### 3.14.2 錯誤碼綁定與流轉機制 (Lifecycle)

錯誤碼從定義到最終響應給前端，會經過以下四個階段的傳遞與轉換：

```mermaid
graph TD
    A[Validator / ApiException] -->|以 String 傳遞錯誤代碼| B[HttpExceptionHandler]
    B -->|解析為 number[] 陣列並拋出| C[ApiFormatMiddleware]
    C -->|包裝為統一 JSON 格式, HTTP 200| D[前端 Axios Client]
```

1. **定義與綁定 (Validator / ApiException)**
   - 在 Class-based Validator 中，VineJS schema 的錯誤訊息**必須對應錯誤碼並字串化**後傳入 `@validate` 裝飾器。例如：
     ```typescript
     @validate(vine.number(), {
       required: CommonCodes.PAGINATE_ERROR.toString()
     })
     ```
   - 在業務邏輯中，若要拋出異常，必須手動拋出 ApiException，傳入數值錯誤碼。例如：
     ```typescript
     throw new ApiException(CommonCodes.PERMISSION_DENIED)
     ```

2. **攔截與轉換 (HttpExceptionHandler)**
   位於 `app/exceptions/handler.ts`，負責將各種錯誤轉換為標準的 API 錯誤物件格式 `{ code: number[], message: string | false }` 後拋出：
   - **驗證錯誤 (E_VALIDATION_ERROR)**：過濾 `messages` 中屬於數值的字串代碼，將其解析為 `number[]` 陣列（若有多個欄位驗證錯誤則陣列會有多個錯誤代碼），若無自訂代碼則預設為 `[CommonCodes.VALIDATOR_MESSAGE_NOT_DEFINED]`。
   - **自訂 ApiException**：提取 `status` 作為錯誤碼陣列元素 `[error.status]`。
   - **非預期系統錯誤**：捕捉為 `[CommonCodes.ERROR]`。

3. **格式化包裝 (ApiFormatMiddleware)**
   全域 API 中介軟體攔截被 `HttpExceptionHandler` 拋出的錯誤結構，並在 `catch(error)` 區塊中：
   - **將 HTTP 狀態碼統一設為 200**。
   - 包裝成含有 `code` 陣列、`message` 描述與 `time` 耗時的 JSON 資料回傳。

4. **前端接收與警報 (Axios Client)**
   前端在 `inertia/pages/lib/request.ts` 中收到 HTTP 200 回應後：
   - 若 `code` 包含 `0`，視為成功並回傳資料。
   - 若 `code` 包含 `401`，則使用 Inertia 轉址回 `/login`。
   - 其餘錯誤代碼皆會觸發 `throw new Error(...)` 並跳出 alert 警告視窗，提示格式為 `錯誤碼: [xxx] + [錯誤描述]`。

### 3.15 Events (事件系統)

- 定義於 `start/events.ts`。
- 可以使用 `emitter.on('db:query', (query) => { ... })` 監聽系統事件，並輸出執行效能與 SQL 語句。

### 3.16 WS (WebSocket)

> 💡 實作範例請參考：[websocket_events.md](./.agents/websocket_events.md#1-socketio-掛載與防抖ioc-手動解析-startwsts)

- 整合 `socket.io`，服務定義於 `start/ws.ts`。
- 透過 `adonisServer.getNodeServer()` 將 Socket.io 掛載在 HTTP 伺服器上。
- **防抖機制 (Debounce)**：使用 Server 端的 Map (如 `dedupeMap`) 限制同一個使用者的請求頻率（如限制 3 秒內不得重複發送扣堂請求）。
- **服務解析**：在 WS 事件中無法自動依賴注入，必須手動透過 `await app.container.make(SessionService)` 解析服務。
- **驗證**：手動使用 `@vinejs/vine` 的 `vine.validate({ schema, data })` 進行資料驗證。
- **資料庫交易**：WS 事件中若有寫入操作，亦需使用 `db.transaction()` 並回傳給 client 端。

### 3.17 Macros (巨集)

專案內稱作 `makcros`，位於 `start/makcros/` 目錄：

- **ModelQueryBuilder 巨集** (`lucid_query_builder_macros.ts`)：
  - `total()`: 快速執行 `count(* as total)` 並取得數值。
  - `exists()`: 檢查資料是否存在。
  - `condiction(reqBody)`: 根據 reqBody 動態生成 where/whereIn 查詢。
  - `pager(page, per_page)`: 提供快速 offset/limit 分頁。
- **HttpRequest 巨集** (`class_validator_macros.ts`)：
  - `validateClass(ValidatorClass)`: 用來解析並編譯 Class-based Validator，執行 VineJS 驗證。
