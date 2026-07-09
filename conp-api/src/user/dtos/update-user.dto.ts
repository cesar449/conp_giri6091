import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'nuevo@rcs.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo válido' })
  email?: string;

  @ApiPropertyOptional({ description: 'Deja vacío para no cambiar la contraseña' })
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({ example: 'María Méndez' })
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'USER'] })
  @IsOptional()
  @IsEnum(['ADMIN', 'USER'], { message: 'El rol debe ser ADMIN o USER' })
  role?: 'ADMIN' | 'USER';
}
