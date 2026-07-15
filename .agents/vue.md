# Vue (Pug + script setup + Hooks) 範例

本文件提供 KSE 專案中 Vue 3 + Pug + Vant UI 以及自訂 Hooks (`useList`, `useApi`) 與後端整合之標準範例。

---

### 1. 前端 CRUD 頁面 (`inertia/pages/admin.vue`)
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
