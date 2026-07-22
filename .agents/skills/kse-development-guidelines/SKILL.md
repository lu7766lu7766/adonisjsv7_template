---
name: kse-development-guidelines
description: KSE 專案開發規範手冊。當開發或維護 KSE 專案，撰寫 AdonisJS v7 後端 (Router, Controller, Service, Model, Validator, Exception, Middleware, WS) 或 Vue 3 前端 (Pug, Vant UI, Composition API, Hooks) 程式碼時觸發此 Skill。
---

# KSE 專案開發規範手冊

本手冊旨在為開發人員與 AI Agent 提供 KSE 專案的架構設計、命名規範與程式碼撰寫風格說明，以維持專案代碼的一致性。

---

## ⚖️ 最高憲法原則 (Mandatory Rule)

1. **接收參數必須使用 `validateClass`**：
   - 本專案所有 HTTP 請求接收參數（Query / Body / Params），**必須透過 `await request.validateClass(ValidatorClassName)` 進行驗證與提取**。
   - **嚴禁**直接呼叫 `request.input()`, `request.qs()`, `request.body()` 或 `request.all()` 繞過 Class-based 驗證。

---

## 📚 各主題獨立說明與範例導覽

- **Router (路由)** ➡️ [router.md](./references/router.md)
- **Controller (控制器)** ➡️ [controller.md](./references/controller.md)
- **Service (服務層)** ➡️ [service.md](./references/service.md)
- **Validator (驗證器)** ➡️ [validator.md](./references/validator.md)
- **Model (模型)** ➡️ [model.md](./references/model.md)
- **Exception (異常處理)** ➡️ [exception.md](./references/exception.md)
- **Middleware (中介軟體)** ➡️ [middleware.md](./references/middleware.md)
- **Response (回應格式 & 錯誤碼)** ➡️ [response.md](./references/response.md)
- **Events (事件系統)** ➡️ [events.md](./references/events.md)
- **WebSocket (即時通訊)** ➡️ [websocket.md](./references/websocket.md)
- **Vue (Composition API + Pug)** ➡️ [vue.md](./references/vue.md)
- **Seeder (種子資料)** ➡️ [seeder.md](./references/seeder.md)
- **Migration (資料庫遷移)** ➡️ [migration.md](./references/migration.md)
- **Constants & Enum (常數與列舉)** ➡️ [constants_enum.md](./references/constants_enum.md)
- **Macros (巨集)** ➡️ [macros.md](./references/macros.md)

---

## 1. 專案技術棧概覽

- **後端框架**：AdonisJS v7 (採用 TypeScript ES Modules)
- **前端框架**：Vue 3 (Composition API / `<script setup>`) + Inertia.js (v2)
- **模板引擎**：Pug (`lang="pug"`)
- **樣式庫**：Tailwind CSS + Vant UI (行動端元件庫)
- **資料庫 ORM**：Lucid ORM (MySQL 2)
- **資料驗證**：VineJS (配合自訂 Class-based Decorator & validateClass 巨集)

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

## 3. 各層級開發規範概要

### 3.1 Router (路由)
- **路由模組化**：宣告在 `start/routes.ts`，拆分至 `start/router/` 目錄（如 `admin.ts`, `super.ts`, `user.ts`, `inertia.ts`）。
- **Prefix與Middleware**：API 以 `api` 為字頭，綁定 `middleware.auth()`, `middleware.role()`, `middleware.api_format()`。

### 3.2 Controller (控制器)
- **依賴注入**：掛載 `@inject()` 並在建構子宣告 `private service: UserService`。
- **資料驗證與交易**：**必須**使用 `request.validateClass(ValidatorClass)` 提取驗證後資料，寫入操作使用 `db.transaction()`，直接 `return` 資料。

### 3.3 Validators (驗證器)
- **Class-based 驗證**：宣告欄位 `declare` 並使用 `@validate(schema, { errorMsg: CommonCodes.XXX.toString() })`。

### 3.4 Service (服務層)
- **查詢複用**：實作私有 `xxx_where_builder`，判斷選填參數時統一使用 `typeof variable != 'undefined'`。

### 3.5 Exception & Response
- 丟出 `ApiException`，由 `HttpExceptionHandler` 與 `ApiFormatMiddleware` 自動包裝為 HTTP 200 JSON `{ code: [...], data, time }`。

### 3.6 Vue 風格
- 使用 Pug 模板 `<template lang="pug">`，結合自訂 `useList(useApi("模組"), search)` Hooks。
