import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, computed, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { RoleEnum } from '#constants/role'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static namingStrategy = new SnakeCaseNamingStrategy()
  public serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column({})
  declare name: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: RoleEnum

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @computed()
  get is_super_admin() {
    return this.role === RoleEnum.SUPER_ADMIN
  }
  @computed()
  get is_admin() {
    return [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN].includes(this.role)
  }
  @computed()
  get is_user() {
    return this.role === RoleEnum.USER
  }
}
