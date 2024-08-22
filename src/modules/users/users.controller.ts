import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/commons/decorators/public.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { BadRequestDto } from 'src/commons/dto/bad-request.dto';
import {
  CreateUserDto,
  ResponseUserDto,
  ResponseUsersDto,
  UpdateUserDto,
} from './dto';

@Controller('users')
@ApiBearerAuth('JWT')
@ApiTags('Users')
@UseGuards(AuthGuard)
@ApiBadRequestResponse({ type: BadRequestDto })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @ApiCreatedResponse({ type: ResponseUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: ResponseUsersDto })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  @ApiOkResponse({ type: ResponseUserDto })
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(+userId);
  }

  @Patch(':userId')
  @ApiOkResponse({ type: ResponseUserDto })
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+userId, updateUserDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(+userId);
  }
}
