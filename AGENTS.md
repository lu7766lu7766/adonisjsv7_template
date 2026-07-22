# KSE 專案開發規範

本專案採用 **AdonisJS v7** (TypeScript ESM) + **Vue 3** (Composition API / Pug / Inertia.js v2) 架構。

---

## 💡 開發指南與規範 (Skill)

在進行本專案的開發、重構或除錯時，請務必參閱並遵從專屬 Skill：
👉 **`kse-development-guidelines`** (`.agents/skills/kse-development-guidelines/SKILL.md`)

詳細程式碼範例與最高憲法規範請參閱 Skill 內的參考檔案：
- [Router (路由)](./.agents/skills/kse-development-guidelines/references/router.md)
- [Controller (控制器)](./.agents/skills/kse-development-guidelines/references/controller.md)
- [Service (服務層)](./.agents/skills/kse-development-guidelines/references/service.md)
- [Validator (驗證器)](./.agents/skills/kse-development-guidelines/references/validator.md)
- [Model (模型)](./.agents/skills/kse-development-guidelines/references/model.md)
- [Exception (異常處理)](./.agents/skills/kse-development-guidelines/references/exception.md)
- [Middleware (中介軟體)](./.agents/skills/kse-development-guidelines/references/middleware.md)
- [Response (回應格式 & 錯誤碼)](./.agents/skills/kse-development-guidelines/references/response.md)
- [Events (事件系統)](./.agents/skills/kse-development-guidelines/references/events.md)
- [WebSocket (即時通訊)](./.agents/skills/kse-development-guidelines/references/websocket.md)
- [Vue (Composition API + Pug)](./.agents/skills/kse-development-guidelines/references/vue.md)
- [Seeder (種子資料)](./.agents/skills/kse-development-guidelines/references/seeder.md)
- [Migration (資料庫遷移)](./.agents/skills/kse-development-guidelines/references/migration.md)
- [Constants & Enum (常數與列舉)](./.agents/skills/kse-development-guidelines/references/constants_enum.md)
- [Macros (巨集)](./.agents/skills/kse-development-guidelines/references/macros.md)

---

## 📌 目錄與路徑別名 (Imports)

開發時請務必使用 `package.json` 所定義的路徑別名，避免使用深層相對路徑：

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
