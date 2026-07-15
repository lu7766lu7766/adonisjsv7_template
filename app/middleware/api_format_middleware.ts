import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ApiFormatMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const start: number = Date.now()
    try {
      await next()

      return ctx.response.status(200).json({
        code: [0],
        data: ctx.response.lazyBody.content?.[0],
        time: Date.now() - start + ' ms',
      })
    } catch (error) {
      return ctx.response.status(200).json({ ...error, time: Date.now() - start + ' ms' })
    }
  }
}
