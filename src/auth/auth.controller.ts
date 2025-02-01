import { Body, Controller, HttpCode, HttpStatus, Post, Res, Req } from '@nestjs/common'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { Message } from './interfaces/auth.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Message> {
    return this.authService.signUp(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response): Promise<Message> {
    const jwt = await this.authService.signIn(dto)
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    })

    return {
      message: 'ok',
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response): Message {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    })

    return {
      message: 'ok',
    }
  }
}
