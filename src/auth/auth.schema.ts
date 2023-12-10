import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const userCore = {
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(2, 'Username must be at least 2 character long'),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(2, 'Password must be at least 2 character long'),
}

const { password, ...userCoreWithoutSensitive } = userCore

const registerUserSchema = z.object({
  ...userCore,
})

const registerUserResponseSchema = z.object({
  id: z.number(),
  ...userCoreWithoutSensitive,
})

const loginUserSchema = z.object({
  ...userCore,
})

const loginUserResponseSchema = z.object({
  id: z.number(),
  ...userCoreWithoutSensitive,
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type LoginUserInput = z.infer<typeof loginUserSchema>

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    registerUserSchema,
    registerUserResponseSchema,
    loginUserSchema,
    loginUserResponseSchema,
  },
  { $id: 'auth' },
)
