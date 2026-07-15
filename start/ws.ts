import adonisServer from '@adonisjs/core/services/server'
import { Server } from 'socket.io'

class WsServer {
  constructor() {
    const io = new Server(adonisServer.getNodeServer(), {
      cors: {
        origin: '*',
      },
    })
    io.on('connection', (socket) => {
      console.log('client connected:', socket.id)

      socket.on('msgFromClient', (data) => {
        console.log('received msgFromClient:', data)
        socket.emit('msgFromBE', { hello: 'from BE', received: data })
      })

      socket.on('disconnect', () => {
        console.log('client disconnected:', socket.id)
      })
    })
  }
}

new WsServer()
console.log('WS Server initialized')
