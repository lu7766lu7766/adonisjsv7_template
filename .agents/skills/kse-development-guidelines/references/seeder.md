# Seeder (種子資料) 規範與範例

## 開發規範

- 繼承 `BaseSeeder`，使用匿名導出 `export default class extends BaseSeeder`。
- `run()` 中的所有資料庫寫入操作應以 `db.transaction(async (trx) => { ... })` 進行，並在 `createMany` 等寫入方法中傳入 `{ client: trx }`。
- 分為 `dev` 與 `prod` Seeders，可使用 `package.json` 中的 `seed:dev` 或 `seed:prod` 執行。

---

## 程式碼範例 (`database/seeders/user_seeder.ts`)

```typescript
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import { RoleEnum } from '#constants/role'

export default class extends BaseSeeder {
  async run() {
    await db.transaction(async (trx) => {
      await User.createMany([
        {
          name: 'Super Admin',
          username: 'superadmin',
          password: 'password',
          role: RoleEnum.SUPER_ADMIN,
        }
      ], { client: trx })
    })
  }
}
```
