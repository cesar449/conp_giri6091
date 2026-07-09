import { Component, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppUser, AppUserRole, ROLE_LABELS } from '../../../core/models/user.model';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = ['name', 'email', 'role', 'createdAt', 'actions'];
  readonly users = signal<AppUser[]>([]);
  readonly loading = signal(false);
  readonly roleLabels = ROLE_LABELS;

  constructor() {
    this.listar();
  }

  get currentUserId(): number | undefined {
    return this.authService.user()?.id;
  }

  listar(): void {
    this.loading.set(true);
    this.userService.listar().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.showMessage('No se pudieron cargar los usuarios', 'error-snackbar');
      },
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '480px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showMessage('Usuario creado correctamente', 'success-snackbar');
        this.listar();
      }
    });
  }

  onEdit(user: AppUser): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '480px',
      data: { mode: 'edit', user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showMessage('Usuario actualizado correctamente', 'success-snackbar');
        this.listar();
      }
    });
  }

  onDelete(user: AppUser): void {
    if (user.id === this.currentUserId) {
      this.showMessage('No puedes eliminar tu propia cuenta', 'error-snackbar');
      return;
    }

    const confirmed = confirm(`¿Deseas eliminar al usuario "${user.name}"?`);
    if (!confirmed) {
      return;
    }

    this.userService.eliminar(user.id).subscribe({
      next: () => {
        this.showMessage('Usuario eliminado correctamente', 'success-snackbar');
        this.listar();
      },
      error: (error: HttpErrorResponse) => {
        const message =
          error.status === 400
            ? 'No puedes eliminar tu propia cuenta'
            : 'No se pudo eliminar el usuario';
        this.showMessage(message, 'error-snackbar');
      },
    });
  }

  getRoleLabel(role: AppUserRole): string {
    return this.roleLabels[role];
  }

  roleClass(role: AppUserRole): string {
    return role === 'ADMIN' ? 'is-admin' : 'is-user';
  }

  private showMessage(message: string, panelClass: string): void {
    this.snackBar.open(message, '', {
      duration: 4000,
      panelClass: [panelClass],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
