export type AppUserRole = 'ADMIN' | 'USER';

export interface AppUser {
  id: number;
  email: string;
  name: string;
  role: AppUserRole;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: AppUserRole;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  name?: string;
  role?: AppUserRole;
}

export const ROLE_LABELS: Record<AppUserRole, string> = {
  ADMIN: 'Administrador',
  USER: 'Usuario',
};
