# AdonisJS 7 + Vue 專案

這是一個基於 AdonisJS v7 (TypeScript ES Modules) 與 Vue 3 (Inertia.js) 建立的專案。

## 快速開始

當您下載或複製此專案到本地端後，請按照以下步驟完成開發環境的設定：

### 1. 安裝專案依賴

使用 `npm` 安裝專案所需的 Node.js 套件：

```bash
npm install
```

### 2. 複製環境變數設定檔

專案中提供了一個 `.env.example` 範本。請將其複製並重新命名為 `.env`：

```bash
cp .env.example .env
```

### 3. 產生應用程式金鑰 (APP_KEY)

複製 `.env` 之後，需要產生專屬的 `APP_KEY` 並寫入環境變數設定中：

```bash
node ace generate:key
```

### 4. 設定資料庫連線

編輯 `.env` 檔案，設定您的 PostgreSQL 資料庫連線資訊：

```ini
DB_CONNECTION=pg
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=您的資料庫帳號
DB_PASSWORD=您的資料庫密碼
DB_DATABASE=您的資料庫名稱
```

### 5. 執行資料庫遷移與種子資料 (選填)

在確保 PostgreSQL 服務已啟動且資料庫已建立後，執行以下指令以套用資料表結構（Migrations）：

```bash
# 執行 Migration
node ace migration:run

# 執行資料庫 Seeders (若有)
node ace db:seed
```

### 6. 啟動開發伺服器

執行以下指令來啟動 AdonisJS 開發伺服器與 Vite HMR（熱模組替換）：

```bash
npm run dev
```

啟動後，您可以在瀏覽器中開啟 `http://localhost:3333` 來訪問本機專案。

---
