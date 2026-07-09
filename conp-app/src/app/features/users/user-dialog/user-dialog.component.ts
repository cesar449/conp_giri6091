import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { AppUser, AppUserRole, ROLE_LABELS } from '../../../core/models/user.model';

export interface UserDialogData {
  mode: 'create' | 'edit';
  user?: AppUser;
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
})
export class UserDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);

  readonly saving = signal(false);
  readonly roleOptions: AppUserRole[] = ['ADMIN', 'USER'];
  readonly roleLabels = ROLE_LABELS;

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(6)]],
    role: ['USER' as AppUserRole, [Validators.required]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserDialogData) {
    if (this.data.mode === 'edit' && this.data.user) {
      this.userForm.patchValue({
        name: this.data.user.name,
        email: this.data.user.email,
        role: this.data.user.role,
      });
      // En edición, la contraseña es opcional (se deja vacía para no cambiarla)
    } else {
      // En creación, la contraseña es obligatoria
      this.userForm
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  get isEdit(): boolean {
    return this.data?.mode === 'edit';
  }

  isInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control && control.touched && control.invalid;
  }

  onSave(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { name, email, password, role } = this.userForm.getRawValue();
    this.saving.set(true);

    const request$ = this.isEdit
      ? this.userService.actualizar(this.data.user!.id, {
          name: name!,
          email: email!,
          role: role!,
          ...(password ? { password } : {}),
        })
      : this.userService.crear({
          name: name!,
          email: email!,
          password: password!,
          role: role!,
        });

    request$.subscribe({
      next: (user) => {
        this.saving.set(false);
        this.dialogRef.close(user);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        const message =
          error.status === 409
            ? 'Ya existe un usuario con ese correo'
            : 'Ocurrió un error al guardar el usuario';
        this.snackBar.open(message, '', {
          duration: 4000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
