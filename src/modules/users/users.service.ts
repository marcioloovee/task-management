import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import {
  CreateUserDto,
  ResponseUserDto,
  ResponseUsersDto,
  UpdateUserDto,
} from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const existUserWithEmail = await this.userRepository.find({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUserWithEmail.length) {
      throw new HttpException('E-mail indisponível', HttpStatus.CONFLICT);
    }

    try {
      createUserDto.password = await this.authService.hashPassword(
        createUserDto.password,
      );

      createUserDto.salt = Math.random().toString();

      const userData = this.userRepository.create(createUserDto);
      return ResponseUserDto.factory(await this.userRepository.save(userData));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<ResponseUsersDto[]> {
    const data = await this.userRepository.find();
    return ResponseUsersDto.factory(data);
  }

  async findOne(userId: number): Promise<ResponseUserDto> {
    const data = await this.userRepository.findOneBy({ userId });

    if (!data) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    return ResponseUserDto.factory(data);
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const existUserWithEmail = await this.userRepository.find({
      where: {
        userId: Not(userId),
        email: updateUserDto.email,
      },
    });

    if (existUserWithEmail.length) {
      throw new HttpException('E-mail indisponível', HttpStatus.CONFLICT);
    }

    try {
      Object.assign(user, updateUserDto);
      user.password = await this.authService.hashPassword(
        updateUserDto.password,
      );

      return ResponseUserDto.factory(await this.userRepository.save(user));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(userId: number): Promise<void> {
    await this.userRepository.softDelete({ userId });
    return;
  }
}
