import { FastifyInstance } from 'fastify'
import { $ref } from './auth.schema'
import { loginUserHandler, registerUserHandler } from './auth.controller'

const authRoutes = async (server: FastifyInstance) => {
  server.post(
    '/register',
    {
      schema: {
        body: $ref('registerUserSchema'),
        response: {
          200: $ref('registerUserResponseSchema'),
        },
      },
    },
    registerUserHandler,
  )

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginUserSchema'),
        response: {
          200: $ref('loginUserResponseSchema'),
        },
      },
    },
    loginUserHandler,
  )
}

export default authRoutes
