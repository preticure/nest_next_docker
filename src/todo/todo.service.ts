import { ForbiddenException, Injectable } from '@nestjs/common'
import { Task } from '@prisma/client'

import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async list(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async read(userId: number, id: number): Promise<Task> {
    return this.prisma.task.findUnique({
      where: {
        id,
        userId,
      },
    })
  }

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    })
    return task
  }

  async update(userId: number, id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
        userId,
      },
    })

    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permission to update')
    }

    return this.prisma.task.update({
      where: { id },
      data: dto,
    })
  }

  async delete(userId: number, id: number): Promise<void> {
    const task = await this.prisma.task.findUnique({ where: { id } })

    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permission to delete')
    }

    await this.prisma.task.delete({ where: { id } })
  }
}
