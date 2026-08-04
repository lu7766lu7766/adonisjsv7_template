// import type { HttpContext } from '@adonisjs/core/http'

import Task from '#models/task'

export default class TasksController {
  list() {
    return Task.query()
  }
}
