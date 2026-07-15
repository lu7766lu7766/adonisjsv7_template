export enum RoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export class RoleConstants {
  static readonly SUPER_ADMIN = RoleEnum.SUPER_ADMIN
  static readonly ADMIN = RoleEnum.ADMIN
  static readonly USER = RoleEnum.USER

  static options() {
    return [{ code: this.SUPER_ADMIN }, { code: this.ADMIN }, { code: this.USER }]
  }

  static enum() {
    return this.options().map((x) => x.code)
  }

  static isSuperAdmin(role: RoleEnum) {
    return [this.SUPER_ADMIN].includes(role)
  }

  static isAdmin(role: RoleEnum) {
    return [this.SUPER_ADMIN, this.ADMIN].includes(role)
  }

  static isUser(role: RoleEnum) {
    return [this.USER].includes(role)
  }
}
