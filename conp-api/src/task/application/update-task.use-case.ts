import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import type { ITaskRepository } from "../domain/task.repository.interface";
import { Task } from "../domain/task.entity";
import { GetTaskByIdUseCase } from "./get-task-by-id.use-case";
import { ITaskRepositoryToken } from "../domain/task.repository.interface";

@Injectable()
export class UpdateTaskUseCase {
    
    private readonly VALID_STATUSES: Task['status'][] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

    constructor(
        @Inject(ITaskRepositoryToken)
        private readonly taskRepository: ITaskRepository,
        private readonly getTaskByIdUseCase: GetTaskByIdUseCase
    ) {}

    async execute(
        id: number, 
        updateData: Partial<Pick<Task, "title" | "description" | "status">>
    ): Promise<Task> {
        // Obtener tarea existente (lanza NotFoundException si no existe)
        const task = await this.getTaskByIdUseCase.execute(id);

        // Actualizar solo los campos proporcionados
        if (updateData.title?.trim()) {
            task.title = updateData.title.trim();
        }
        
        if (updateData.description?.trim()) {
            task.description = updateData.description.trim();
        }
        
        if (updateData.status) {
            if (!this.VALID_STATUSES.includes(updateData.status)) {
                throw new BadRequestException(
                    `Estado inválido: "${updateData.status}". Estados permitidos: ${this.VALID_STATUSES.join(', ')}`
                );
            }
            task.status = updateData.status;
        }

        // Persistir cambios
        return await this.taskRepository.update(task);
    }
}