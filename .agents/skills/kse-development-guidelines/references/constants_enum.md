# Constants & Enum 規範與範例

## 開發規範

- **角色定義**：
  - 定義 `RoleEnum` (為 Enum) 做為資料庫存取的值。
  - 同時定義 `RoleConstants` (為 Class) 做為工具類別，提供 `options()`、`enum()` 陣列及靜態判斷方法（如 `isAdmin(role)`）。
- **API 錯誤代碼**：
  - 統一存放在 `app/constants/api_codes/` 底下。
  - `CommonCodes` 儲存系統通用錯誤代碼，模組特定代碼依模組名稱分類（如 `user3000.ts`, `session2000.ts` 等），代碼以 Class 的 `static readonly` 宣告。

---

## 程式碼範例 (`app/constants/role.ts`)

```typescript
export enum RoleEnum {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  USER = 3,
}

export class RoleConstants {
  static isAdmin(role: RoleEnum) {
    return [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN].includes(role)
  }

  static options() {
    return [
      { label: '超級管理員', value: RoleEnum.SUPER_ADMIN },
      { label: '管理員', value: RoleEnum.ADMIN },
      { label: '一般使用者', value: RoleEnum.USER },
    ]
  }
}
```
