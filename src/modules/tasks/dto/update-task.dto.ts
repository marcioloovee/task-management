import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskPriority } from '../entities/task.entity';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Task 1' })
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  title?: string;

  @ApiPropertyOptional({ example: 'Task description' })
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2022-01-01' })
  @IsDateString()
  dueDate?: Date;

  @ApiPropertyOptional({ example: TaskPriority.MEDIUM, enum: TaskPriority })
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  completed?: boolean;
}
