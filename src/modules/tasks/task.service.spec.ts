import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskPriority } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto, FilterTaskDto } from './dto';
import { Project } from '../projects/entities/project.entity';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let projectRepository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        dueDate: new Date('2023-08-20'),
        priority: TaskPriority.MEDIUM,
        completed: false,
        projectId: 1,
      };

      const user: User = new User();
      user.userId = 1;
      user.name = 'Test User';

      const project = new Project();
      project.projectId = 1;
      project.title = 'Test Project';

      const task = new Task();
      task.taskId = 1;
      task.title = createTaskDto.title;
      task.description = createTaskDto.description;
      task.dueDate = createTaskDto.dueDate;
      task.priority = createTaskDto.priority;
      task.completed = createTaskDto.completed;
      task.user = user;
      task.project = project;

      jest.spyOn(projectRepository, 'findOneBy').mockResolvedValue(project);
      jest.spyOn(taskRepository, 'create').mockReturnValue(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);

      const result = await service.create(createTaskDto, user);

      expect(result.title).toEqual(createTaskDto.title);
      expect(result.description).toEqual(createTaskDto.description);
      expect(result.dueDate).toEqual(createTaskDto.dueDate);
      expect(result.priority).toEqual(createTaskDto.priority);
      expect(result.completed).toEqual(createTaskDto.completed);
      expect(result.user).toEqual(user);
      expect(result.project).toEqual(project);

      expect(taskRepository.create).toHaveBeenCalledWith({
        user,
        project,
        ...createTaskDto,
      });
      expect(taskRepository.save).toHaveBeenCalledWith(task);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { taskId: task.taskId },
        relations: ['user', 'project'],
      });
    });

    it('should throw an exception if project not found', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        dueDate: new Date(),
        priority: TaskPriority.MEDIUM,
        completed: false,
        projectId: 1,
      };
      const user: User = new User();

      jest.spyOn(projectRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(createTaskDto, user)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const filterTaskDto: FilterTaskDto = {};

      jest.spyOn(taskRepository, 'find').mockResolvedValue([new Task()]);

      const result = await service.findAll(new User(), filterTaskDto);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a task', async () => {
      const taskId = 1;

      const user = new User();
      user.userId = 1;
      user.name = 'Test User';

      const project = new Project();
      project.projectId = 1;
      project.title = 'Test Project';

      const task = new Task();
      task.taskId = taskId;
      task.title = 'Test Task';
      task.description = 'Task description';
      task.dueDate = new Date('2023-08-20');
      task.priority = TaskPriority.MEDIUM;
      task.completed = false;
      task.user = user;
      task.project = project;

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);

      const result = await service.findOne(taskId, user);

      expect(result.taskId).toBe(taskId);
      expect(result.title).toBe(task.title);
      expect(result.description).toBe(task.description);
      expect(result.dueDate).toEqual(task.dueDate);
      expect(result.priority).toBe(task.priority);
      expect(result.completed).toBe(task.completed);
      expect(result.user).toEqual(user);
      expect(result.project).toEqual(project);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
        relations: ['user', 'project'],
      });
    });

    it('should throw an exception if task is not found', async () => {
      const taskId = 999;

      const user = new User();
      user.userId = 1;
      user.name = 'Test User';

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(taskId, user)).rejects.toThrow(
        'Task não encontrado',
      );

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
        relations: ['user', 'project'],
      });
    });
  });

  describe('update', () => {
    it('should update and return a task', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const task = new Task();

      jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);

      const result = await service.update(taskId, updateTaskDto, new User());

      expect(result.title).toEqual(updateTaskDto.title);
      expect(taskRepository.save).toHaveBeenCalled();
    });

    it('should throw an exception if task not found', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

      jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.update(taskId, updateTaskDto, new User()),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const taskId = 1;

      jest.spyOn(taskRepository, 'softDelete').mockResolvedValue(undefined);

      await service.remove(taskId, new User());

      expect(taskRepository.softDelete).toHaveBeenCalledWith({ taskId });
    });
  });

  describe('completed', () => {
    it('should mark a task as completed', async () => {
      const taskId = 1;
      const task = new Task();
      task.completed = false;

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);

      const result = await service.completed(taskId, new User());

      expect(result).toBeInstanceOf(Object);
      expect(task.completed).toBe(true);
      expect(taskRepository.save).toHaveBeenCalled();
    });

    it('should throw an exception if task not found', async () => {
      const taskId = 1;

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      await expect(service.completed(taskId, new User())).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('pending', () => {
    it('should mark a task as pending', async () => {
      const taskId = 1;
      const task = new Task();
      task.completed = true;

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);

      const result = await service.pending(taskId, new User());

      expect(result).toBeInstanceOf(Object);
      expect(task.completed).toBe(false);
      expect(taskRepository.save).toHaveBeenCalled();
    });

    it('should throw an exception if task not found', async () => {
      const taskId = 1;

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      await expect(service.pending(taskId, new User())).rejects.toThrow(
        HttpException,
      );
    });
  });
});
