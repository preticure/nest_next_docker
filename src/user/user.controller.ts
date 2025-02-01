import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { User } from '@prisma/client'

import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getCurrentUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
    return req.user
  }

  @Patch()
  update(@Req() req: Request, @Body() dto: UpdateUserDto): Promise<Omit<User, 'hashedPassword'>> {
    return this.userService.update(req.user.id, dto)
  }
}
