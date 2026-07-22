import Factory from '@adonisjs/lucid/factories'
import Task from '#models/task'

export const TaskFactory = Factory.define(Task, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
    isCompleted: faker.datatype.boolean(),
  }
}).build()
