import { Module } from '@nestjs/common';
import { TasksModule } from './task/infrastructure/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TasksModule,
    UsersModule
  ],
})
export class AppModule {}
