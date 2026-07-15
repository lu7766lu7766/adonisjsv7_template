import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { LucidRow } from '@adonisjs/lucid/types/model'

declare module '@adonisjs/lucid/types/model' {
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    total(): Promise<number>
    exists(): Promise<boolean>
    condiction(
      reqBody: Record<string, string | number | string[] | number[]>
    ): ModelQueryBuilderContract<Model>
    pager(page: number, per_page: number): ModelQueryBuilderContract<Model>
  }
}
declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    total(): Promise<number>
    exists(): Promise<boolean>
    condiction(reqBody: Record<string, string | number | string[] | number[]>): ModelQueryBuilder
    pager(page: number, per_page: number): ModelQueryBuilder
  }
}

ModelQueryBuilder.macro('total', function (this: ModelQueryBuilder) {
  return this.count('* as total')
    .first()
    .then((res: LucidRow | null) => res?.$extras.total.valueOf() ?? 0)
})
ModelQueryBuilder.macro('exists', function (this: ModelQueryBuilder) {
  return this.total().then((total) => total > 0)
})
ModelQueryBuilder.macro(
  'condiction',
  function (
    this: ModelQueryBuilder,
    reqBody: Record<string, string | number | string[] | number[]>
  ) {
    for (const key in reqBody) {
      if (typeof reqBody[key] === 'object') {
        this.whereIn(key, reqBody[key])
      } else {
        this.where(key, reqBody[key])
      }
    }
    return this
  }
)
ModelQueryBuilder.macro(
  'pager',
  function (this: ModelQueryBuilder, page: number, per_page: number) {
    this.offset((page - 1) * per_page).limit(per_page)
    return this
  }
)
