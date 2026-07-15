import { Exception } from '@adonisjs/core/exceptions'

export class ApiException extends Exception {
  constructor(status: number, message = 'false') {
    super(message, { status, code: 'API_EXCEPTION' })
  }
}
