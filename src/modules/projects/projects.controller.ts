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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  ResponseProjectDto,
  ResponseProjectsDto,
  UpdateProjectDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequestDto } from 'src/commons/dto/bad-request.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('projects')
@ApiBearerAuth('JWT')
@ApiTags('Projects')
@UseGuards(AuthGuard)
@ApiBadRequestResponse({ type: BadRequestDto })
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiCreatedResponse({ type: ResponseProjectDto })
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectsService.create(createProjectDto, req.user.user);
  }

  @Get()
  @ApiOkResponse({ type: ResponseProjectsDto })
  findAll(@Req() req) {
    return this.projectsService.findAll(req.user.user);
  }

  @Get(':projectId')
  @ApiOkResponse({ type: ResponseProjectDto })
  findOne(@Param('projectId') projectId: string, @Req() req) {
    return this.projectsService.findOne(+projectId, req.user.user);
  }

  @Patch(':projectId')
  @ApiOkResponse({ type: ResponseProjectDto })
  update(
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req,
  ) {
    return this.projectsService.update(
      +projectId,
      updateProjectDto,
      req.user.user,
    );
  }

  @Delete(':projectId')
  remove(@Param('projectId') projectId: string, @Req() req) {
    return this.projectsService.remove(+projectId, req.user.user);
  }
}
