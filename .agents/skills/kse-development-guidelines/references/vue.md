# Vue (Composition API + Pug) 規範與範例

## 開發規範

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

---

## 程式碼範例 (`inertia/pages/admin.vue`)

```html
<template lang="pug">
Layout
  div(class="text-gray-700 text-2xl mb-4") 管理者管理
  div(class="search flex justify-between")
    Button(plain, size="small", @click="showCreate({ role: RoleEnum.ADMIN })") 新增
  
  // DataTable 元件
  DataTable(class="mt-4", :columns="columns", :datas="datas", :page_index="page_index")
    template(#action="{ data }")
      div(class="flex gap-4")
        Button(plain, size="small", @click="showUpdate(data)") 編輯
        Button(plain, size="small", type="danger", @click="doDelete(data.id)") 刪除

  // Pagination 元件
  Pagination(
    class="mt-4"
    :items-per-page="paginate.per_page"
    :total-items="paginate.total"
    @update:modelValue="setPage"
    v-model="paginate.page"
  )

  // 彈窗 Model 元件 & Vant UI 表單
  Model(title="新增", @submit="create()", v-model:show="createShow")
    Field(label="姓名*", :rules="[required()]", v-model="createData.name") 
    Field(label="帳號*", :rules="[required()]", v-model="createData.username") 
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import Layout from "~/layouts/app.vue"
import { useApi } from "./lib/api"
import { useList } from "./lib/list"
import { Field, Button } from "vant"
import Pagination from "~/components/pagination.vue"
import DataTable from "~/components/data_table.vue"
import Model from "~/components/model.vue"
import { required } from "~/pages/lib/rules"
import { RoleEnum } from "#constants/role"

const search = ref({ role: "" })

// 使用 useList 巨集 Hook 綁定對應的 useApi 模組，高度簡化 CRUD 流程
const {
  datas,
  paginate,
  page_index,
  createShow,
  updateShow,
  createData,
  updateData,
  refresh,
  setPage,
  showCreate,
  showUpdate,
  create,
  update,
  doDelete,
} = useList(useApi("admin"), search)

const columns = [
  { key: "name", label: "姓名" },
  { key: "username", label: "帳號" },
  { key: "action", label: "操作" },
]

onMounted(() => {
  refresh()
})
</script>
```
