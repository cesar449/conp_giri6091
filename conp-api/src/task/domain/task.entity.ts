//! DOminio: Capa de datos puros
//! Entidad: MOdelo de datos 

export class Task {
    constructor(
        public readonly id: number,
        public title: string,
        public description: string,
        public status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED',
        public createdAt: Date
    ) {}

    // Lógical en la capa de dominio
    complete() {
        this.status = 'COMPLETED';
    }
}