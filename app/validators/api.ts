import vine from '@vinejs/vine'
import { validate } from '#start/makcros/class_validator_macros'
import { CommonCodes } from '#constants/api_codes/common'

export class ApiTestValidator {
  @validate(vine.string().optional(), {
    string: CommonCodes.ERROR.toString(),
  })
  declare test?: string
}
