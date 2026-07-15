import { CommonCodes } from '#constants/api_codes/common'
import { RoleEnum } from '#constants/role'
import { ApiException } from '#exceptions/api_exception'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle({ auth }: HttpContext, next: NextFn, roles: RoleEnum[]) {
    if (!auth.isAuthenticated) {
      throw new ApiException(CommonCodes.PERMISSION_DENIED)
    }
    const user = auth.user!
    if (!roles.includes(user.role)) {
      throw new ApiException(CommonCodes.PERMISSION_DENIED)
    }

    const output = await next()
    return output
  }
}
