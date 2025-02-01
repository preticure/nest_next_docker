import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(id: number, dto: UpdateUserDto): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
    })
    user.hashedPassword = undefined

    return user
  }
}
