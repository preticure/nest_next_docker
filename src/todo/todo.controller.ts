import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

import { Task } from '@prisma/client'

import { TodoService } from './todo.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  list(@Req() req: Request): Promise<Task[]> {
    return this.todoService.list(req.user.id)
  }

  @Get(':id')
  read(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.todoService.read(req.user.id, id)
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto): Promise<Task> {
    return this.todoService.create(req.user.id, dto)
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto): Promise<Task> {
    return this.todoService.update(req.user.id, id, dto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todoService.delete(req.user.id, id)
  }
}
