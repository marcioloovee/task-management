import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  CreateTaskDto,
  ResponseTaskDto,
  ResponseTasksDto,
  UpdateTaskDto,
} from './dto';
import { Project } from '../projects/entities/project.entity';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<ResponseTaskDto> {
    const project = await this.projectRepository.findOneBy({
      projectId: createTaskDto.projectId,
    });
    delete createTaskDto.projectId;

    if (!project) {
      throw new HttpException('Projeto não encontrado', HttpStatus.NOT_FOUND);
    }

    const task = this.taskRepository.create({
      user,
      project,
      ...createTaskDto,
    });
    const savedTask = await this.taskRepository.save(task);

    const newTask = await this.taskRepository.findOne({
      where: { taskId: savedTask.taskId },
      relations: ['user', 'project'],
    });

    return ResponseTaskDto.factory(newTask);
  }

  async findAll(
    user: User,
    params: FilterTaskDto,
  ): Promise<ResponseTasksDto[]> {
    const where: any = {};

    if (params.title) {
      where.title = Like('%' + params.title + '%');
    }

    if (params.priority) {
      where.priority = params.priority;
    }

    if (params.completed !== undefined) {
      where.completed = params.completed === 'true' ? true : false;
    }

    if (params.userId) {
      where.user = { userId: params.userId };
    }

    if (params.projectId) {
      where.project = { projectId: params.projectId };
    }

    const data = await this.taskRepository.find({
      where,
      relations: ['user', 'project'],
    });
    return ResponseTasksDto.factory(data);
  }

  async findOne(taskId: number, user: User): Promise<ResponseTaskDto> {
    const data = await this.taskRepository.findOne({
      where: { taskId },
      relations: ['user', 'project'],
    });

    if (!data) {
      throw new HttpException('Task não encontrado', HttpStatus.NOT_FOUND);
    }

    return ResponseTaskDto.factory(data);
  }

  async update(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<ResponseTaskDto> {
    const task = await this.taskRepository.findOneBy({ taskId });

    if (!task) {
      throw new HttpException('Task não encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      Object.assign(task, updateTaskDto);

      return ResponseTaskDto.factory(await this.taskRepository.save(task));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(taskId: number, user: User) {
    await this.taskRepository.softDelete({ taskId });
    return;
  }

  async completed(taskId: number, user: User): Promise<ResponseTaskDto> {
    const task = await this.taskRepository.findOne({
      where: { taskId },
      relations: ['user', 'project'],
    });

    if (!task) {
      throw new HttpException('Task não encontrado', HttpStatus.NOT_FOUND);
    }

    task.completed = true;
    const savedTask = await this.taskRepository.save(task);

    return ResponseTaskDto.factory(savedTask);
  }

  async pending(taskId: number, user: User): Promise<ResponseTaskDto> {
    const task = await this.taskRepository.findOne({
      where: { taskId },
      relations: ['user', 'project'],
    });

    if (!task) {
      throw new HttpException('Task não encontrado', HttpStatus.NOT_FOUND);
    }

    task.completed = false;
    const savedTask = await this.taskRepository.save(task);

    return ResponseTaskDto.factory(savedTask);
  }
}
