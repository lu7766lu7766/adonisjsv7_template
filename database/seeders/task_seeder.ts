import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import { TaskFactory } from '../factories/task_factory.js'

export default class extends BaseSeeder {
  async run() {
    await db.transaction(async (trx) => {
      // 建立一個範例 User
      const user = await User.create(
        {
          full_name: 'Root User',
          username: 'root',
          password: 'root',
        },
        { client: trx }
      )

      // 使用 TaskFactory 關聯該 User，批次建立 5 個隨機 Task
      await TaskFactory.merge({ userId: user.id }).client(trx).createMany(5)
    })
  }
}
