import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptions } from 'typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/tasks/task.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forRoot(typeOrmOptions), TaskModule, ProjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
