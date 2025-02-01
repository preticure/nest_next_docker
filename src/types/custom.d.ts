import { User } from '@prisma/client'

declare module 'express' {
  interface Request {
    user?: Omit<User, 'hashedPassword'>
  }
}
