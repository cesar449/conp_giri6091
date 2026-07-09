import { Inject, Injectable} from "@nestjs/common";
import type{ ITaskRepository } from "../domain/task.repository.interface";
import { Task } from "../domain/task.entity";
import { ITaskRepositoryToken } from "../domain/task.repository.interface";

@Injectable()
export class GetTaskByIdUseCase {
    
    constructor(
        @Inject(ITaskRepositoryToken)
        private readonly taskRepository: ITaskRepository
    ) {}

    async execute(id: number): Promise<Task> {
        const task = await this.taskRepository.findById(id);
        if (!task) 
            throw new Error("Task not found");
        
        return task;
    }
}