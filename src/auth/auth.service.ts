import { Injectable, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { AuthDto } from './dto/auth.dto'
import { PrismaService } from '../prisma/prisma.service'
import type { Message, Jwt } from './interfaces/auth.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(dto: AuthDto): Promise<Message> {
    const hashed = await bcrypt.hash(dto.password, 12)
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
        },
      })
      return {
        message: 'ok',
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This email is already taken')
        }
      }
      throw error
    }
  }

  async signIn(dto: AuthDto): Promise<Jwt> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    if (!user) throw new ForbiddenException('Email or password is incorrect')

    const isValid = await bcrypt.compare(dto.password, user.hashedPassword)
    if (!isValid) throw new ForbiddenException('Email or password is incorrect')

    return this.generateJwt(user.id, user.email)
  }

  async generateJwt(userId: number, email: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      email,
    }
    const secret = this.config.get('JWT_SECRET')
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '5m',
      secret: secret,
    })
    return { accessToken: token }
  }
}
