import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from '../application/create-task.use';
import { UpdateTaskUseCase } from '../application/update-task.use-case';
import { GetTaskByIdUseCase } from '../application/get-task-by-id.use-case';
import { DeleteTaskUseCase } from '../application/delete-task.use-case';
import { ITaskRepositoryToken } from '../domain/task.repository.interface';
import { TaskRepositoryImpl } from './persistence/task.repository.impl';
import { TaskController } from './controllers/task.controller';
import { TaskRepositoryPrismaImpl } from './persistence/task.repository.prisma.impl';


@Module({
    controllers: [ TaskController ],
    providers: [
        CreateTaskUseCase,
        GetTaskByIdUseCase,
        UpdateTaskUseCase,
        DeleteTaskUseCase,
        {
            provide: ITaskRepositoryToken,
            useClass: TaskRepositoryPrismaImpl // Cambiar si la data base canbia.
        }
    ],
    exports: [ CreateTaskUseCase ]
  
})

export class TasksModule {}