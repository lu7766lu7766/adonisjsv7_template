import { HttpRequest } from '@adonisjs/core/http'
import vine, { BaseLiteralType, SimpleMessagesProvider } from '@vinejs/vine'
import { SchemaTypes } from '@vinejs/vine/types'
import _ from 'lodash'

declare module '@adonisjs/core/http' {
  interface HttpRequest {
    validateClass<T>(ValidatorClass: new () => T): Promise<T>
  }
}

HttpRequest.macro('validateClass', async function <T, U>(this: HttpRequest, ValidatorClass: new () => T) {
  const allRules: Record<string, BaseLiteralType<U, U, U>> = {}
  const allMessages: Record<string, string> = {}
  const instance = new ValidatorClass()
  for (const prop in instance) {
    const { rules, messages = {} } = instance[prop] as {
      rules: BaseLiteralType<U, U, U>
      messages?: Record<string, string>
    }
    allRules[prop] = rules
    Object.assign(
      allMessages,
      _.mapKeys(messages, (_v: unknown, rk: string) => `${prop}.${rk}`)
    )
  }
  const validator = vine.compile(vine.object(allRules))
  validator.messagesProvider = new SimpleMessagesProvider(allMessages)

  return this.validateUsing(validator) as T
})

export const validate = (schema: SchemaTypes, messages?: Record<string, string>) => {
  return function (target: any, propertyKey: string) {
    target[propertyKey] = {
      rules: schema,
      messages: messages,
    }
  }
}
