//!Dealer (contratador del repositorio)
import { Task } from "./task.entity";

export interface ITaskRepository {
    create(task: Task): Promise<Task>;
    findAll(): Promise<Task[]>;
    findById(id: number): Promise<Task | null>;
    update(task: Task): Promise<Task>;
    delete(id: number): Promise<boolean>;
}

//token para la inyección de dependencias
export const ITaskRepositoryToken = Symbol('ITaskRepository');