import logger from '@adonisjs/core/services/logger'

import emitter from '@adonisjs/core/services/emitter'

emitter.on('db:query', function (query) {
  logger.info(
    `${((query.duration?.[1] ?? 0) / 1000000).toFixed(2)} ms ${query.sql} ${query.bindings ? JSON.stringify(query.bindings) : ''}`
  )
})
