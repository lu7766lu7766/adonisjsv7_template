# Macros (巨集) 規範與範例

## 開發規範

專案內巨集檔擴充 AdonisJS 核心介面，位於 `start/makcros/` 目錄：

- **ModelQueryBuilder 巨集** (`lucid_query_builder_macros.ts`)：
  - `total()`: 快速執行 `count(* as total)` 並取得數值。
  - `exists()`: 檢查資料是否存在。
  - `condiction(reqBody)`: 根據 reqBody 動態生成 where/whereIn 查詢。
  - `pager(page, per_page)`: 提供快速 offset/limit 分頁。
- **HttpRequest 巨集** (`class_validator_macros.ts`)：
  - `validateClass(ValidatorClass)`: 用來解析並編譯 Class-based Validator，執行 VineJS 驗證。
