import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { BadRequestDto } from 'src/commons/dto/bad-request.dto';
import {
  CreateTaskDto,
  FilterTaskDto,
  ResponseTaskDto,
  ResponseTasksDto,
  UpdateTaskDto,
} from './dto';

@Controller('task')
@ApiBearerAuth('JWT')
@ApiTags('Tasks')
@UseGuards(AuthGuard)
@ApiBadRequestResponse({ type: BadRequestDto })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiCreatedResponse({ type: ResponseTaskDto })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req,
  ): Promise<ResponseTaskDto> {
    return await this.taskService.create(createTaskDto, req.user.user);
  }

  @Get()
  @ApiOkResponse({ type: ResponseTasksDto })
  findAll(@Req() req, @Query() params: FilterTaskDto) {
    return this.taskService.findAll(req.user.user, params);
  }

  @Get(':taskId')
  @ApiOkResponse({ type: ResponseTaskDto })
  findOne(@Param('taskId') taskId: string, @Req() req) {
    return this.taskService.findOne(+taskId, req.user.user);
  }

  @Patch(':taskId')
  @ApiOkResponse({ type: ResponseTasksDto })
  update(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.taskService.update(+taskId, updateTaskDto, req.user.user);
  }

  @Delete(':taskId')
  remove(@Param('taskId') taskId: string, @Req() req) {
    return this.taskService.remove(+taskId, req.user.user);
  }

  @Post(':taskId/completed')
  completed(@Param('taskId') taskId: string, @Req() req) {
    return this.taskService.completed(+taskId, req.user.user);
  }

  @Post(':taskId/pending')
  pending(@Param('taskId') taskId: string, @Req() req) {
    return this.taskService.pending(+taskId, req.user.user);
  }
}
