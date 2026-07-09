import { CreateTaskUseCase } from '@/task/application/create-task.use';
import { DeleteTaskUseCase } from '@/task/application/delete-task.use-case';
import { GetTaskByIdUseCase } from '@/task/application/get-task-by-id.use-case';
import { UpdateTaskUseCase } from '@/task/application/update-task.use-case';
import { ITaskRepositoryToken } from '@/task/domain/task.repository.interface';
import type { ITaskRepository } from '@/task/domain/task.repository.interface';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Param,
  Delete,
  HttpStatus,
  Patch,
  HttpCode,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'tasks', version: '1' })
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de tareas obtenida exitosamente.' })
  async findAll() {
    return this.taskRepository.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nueva tarea' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Tarea creada exitosamente.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos.' })
  async create(@Body() task: CreateTaskDto) {
    return this.createTaskUseCase.execute(task.title, task.description);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una tarea por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarea', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tarea encontrada exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarea no encontrada.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getTaskByIdUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una tarea por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarea a actualizar', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tarea actualizada exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarea no encontrada.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTask: UpdateTaskDto,
  ) {
    return this.updateTaskUseCase.execute(id, updateTask);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina una tarea por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarea a eliminar', type: Number })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Tarea eliminada exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tarea no encontrada.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteTaskUseCase.execute(id);
  }
}