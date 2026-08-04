/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import { ApiTestValidator } from '#validators/api'
import UsersController from '#controllers/users_controller'

router.on('/').renderInertia('home', {}).as('home')
router.on('/demo').renderInertia('demo', {}).as('demo')

router.post('api/login', [UsersController, 'login'])

// Restful API
// GET 查詢
// POST 新增
// PUT 更新
// DELETE 刪除
router.post('api', () => 'ok')
