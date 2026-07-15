import { Factory } from '@adonisjs/lucid/factories'
import Task from '#models/task'

export const TaskFactory = Factory
  .define(Task, ({ faked }) => {
    return {
      title: faked.lorem.sentence(),
      isCompleted: faked.datatype.boolean(),
    }
  })
  .build()
