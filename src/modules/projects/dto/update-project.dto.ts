import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Project 1' })
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  title?: string;

  @ApiPropertyOptional({ example: 'Project description' })
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  description?: string;
}
