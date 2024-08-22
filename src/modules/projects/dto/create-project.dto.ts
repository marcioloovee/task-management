import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Project 1' })
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Project description' })
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  description: string;
}
