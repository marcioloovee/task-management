import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task 1' })
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Task description' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ example: TaskPriority.MEDIUM, enum: TaskPriority })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({ example: false })
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  projectId: number;
}
