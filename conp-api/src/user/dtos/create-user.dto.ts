import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'nuevo@rcs.com', description: 'Correo del usuario' })
  @IsEmail({}, { message: 'Debe proporcionar un correo válido' })
  email!: string;

  @ApiProperty({ example: 'Clave123!', description: 'Contraseña del usuario' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @ApiProperty({ example: 'María Méndez', description: 'Nombre completo' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'USER', enum: ['ADMIN', 'USER'], description: 'Rol del usuario' })
  @IsEnum(['ADMIN', 'USER'], { message: 'El rol debe ser ADMIN o USER' })
  role!: 'ADMIN' | 'USER';
}
