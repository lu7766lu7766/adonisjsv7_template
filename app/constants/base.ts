import { ApiException } from '#exceptions/api_exception'
import { CommonCodes } from '#constants/api_codes/common'

export abstract class BaseConstants {
  static options(): { id: number; code: string }[] {
    return []
  }

  static enum() {
    return Object.keys(this).map((key) => (this as any)[key])
  }

  static enumId() {
    return this.options().map((x) => x.id)
  }

  static findById(id: number) {
    return this.options().find((x) => x.id == id)
  }

  static findByCode(code: string) {
    return this.options().find((x) => x.code == code)
  }

  static findIdByCode(code: string): number {
    if (this.enum().includes(code)) {
      return this.options().find((x) => x.code == code)!.id
    }
    throw new ApiException(CommonCodes.ERROR, `${code} not in ref`)
  }
  static findIdsByCodes(codes: string[]): number[]
  static findIdsByCodes(...codes: string[]): number[]
  static findIdsByCodes(...codes: string[] | string[][]): number[] {
    if (codes.length == 1 && typeof codes[0] === 'object') {
      return codes[0].map((code) => this.findIdByCode(code))
    }
    return (codes as string[]).map((code) => this.findIdByCode(code))
  }
}
