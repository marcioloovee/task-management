import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { ResponseUserDto } from 'src/modules/users/dto';
import { Project } from '../entities/project.entity';

export class ResponseProjectsDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'The id of the project' })
  projectId: number;

  @Expose()
  @ApiProperty({
    example: 'Project 1',
    description: 'The title of the project',
  })
  title: string;

  @Expose()
  @ApiProperty({
    example: 'Project description',
    description: 'The description of the project',
  })
  description: string;

  @Expose()
  @ApiProperty({ example: '2022-01-01', description: 'The creation date' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2022-01-01', description: 'The update date' })
  updatedAt: Date;

  static factory(projects: Project[]): ResponseProjectsDto[] {
    return plainToInstance(ResponseProjectsDto, projects, {
      excludeExtraneousValues: true,
    });
  }
}
