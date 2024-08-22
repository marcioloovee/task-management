import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import {
  CreateProjectDto,
  ResponseProjectDto,
  ResponseProjectsDto,
  UpdateProjectDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const project = this.projectRepository.create(createProjectDto);
    const savedProject = await this.projectRepository.save(project);

    return ResponseProjectDto.factory(savedProject);
  }

  async findAll(user: User): Promise<ResponseProjectsDto[]> {
    const data = await this.projectRepository.find();
    return ResponseProjectsDto.factory(data);
  }

  async findOne(projectId: number, user: User): Promise<ResponseProjectDto> {
    const data = await this.projectRepository.findOne({
      where: { projectId },
    });

    if (!data) {
      throw new HttpException('Projeto não encontrado', HttpStatus.NOT_FOUND);
    }

    return ResponseProjectDto.factory(data);
  }

  async update(
    projectId: number,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ): Promise<ResponseProjectDto> {
    const project = await this.projectRepository.findOneBy({ projectId });

    if (!project) {
      throw new HttpException('Task não encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      Object.assign(project, updateProjectDto);

      return ResponseProjectDto.factory(
        await this.projectRepository.save(project),
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(projectId: number, user: User) {
    await this.projectRepository.softDelete({ projectId });
    return;
  }
}
