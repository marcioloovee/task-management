import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { Task, TaskPriority } from '../entities/task.entity';
import { ResponseUserDto } from 'src/modules/users/dto';
import { ResponseProjectDto } from 'src/modules/projects/dto';

export class ResponseTasksDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'The id of the task' })
  taskId: number;

  @Expose()
  @ApiProperty({ example: 'Task 1', description: 'The title of the task' })
  title: string;

  @Expose()
  @ApiProperty({
    example: 'Task description',
    description: 'The description of the task',
  })
  description: string;

  @Expose()
  @ApiProperty({
    example: '2022-01-01',
    description: 'The due date of the task',
  })
  dueDate: Date;

  @Expose()
  @ApiProperty({
    example: TaskPriority.MEDIUM,
    description: 'The priority of the task',
  })
  priority: string;

  @Expose()
  @ApiProperty({ example: false, description: 'The status of the task' })
  completed: boolean;

  @Expose()
  @ApiProperty({ example: '2022-01-01', description: 'The creation date' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2022-01-01', description: 'The update date' })
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  user: ResponseUserDto;

  @Expose()
  @ApiProperty()
  project: ResponseProjectDto;

  static factory(tasks: Task[]): ResponseTasksDto[] {
    return tasks.map((task) => {
      const taskDto = plainToInstance(ResponseTasksDto, task, {
        excludeExtraneousValues: true,
      });

      taskDto.user = ResponseUserDto.factory(task.user);
      taskDto.project = ResponseProjectDto.factory(task.project);

      return taskDto;
    });
  }
}
