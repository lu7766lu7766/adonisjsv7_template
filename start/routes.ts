/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

router.on('/').renderInertia('home', {}).as('home')
router.on('/demo').renderInertia('demo', {}).as('demo')

router
  .group(() => {
    router.get('', () => 'ok')
    router.post('login', [UsersController, 'login'])
    router
      .group(() => {
        router.get('self', [UsersController, 'self']) //.use(middleware.auth())
        router.post('logout', [UsersController, 'logout'])
      })
      .use(middleware.auth())
  })
  .prefix('api')
  .use(middleware.api_format())
// Restful API
// GET 查詢
// POST 新增
// PUT 更新
// DELETE 刪除
