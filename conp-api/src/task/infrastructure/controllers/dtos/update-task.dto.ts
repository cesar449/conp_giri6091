import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    description: 'El estado de la tarea',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    example: 'PENDING',
    required: false,
  })
  @IsOptional()  // ← Primero IsOptional
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED'], {
    message: 'El estado debe ser PENDING, IN_PROGRESS o COMPLETED',
  })
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}