import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from '../users/dto/response-user.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async signIn(signInDto: signInDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: signInDto.email,
      },
    });

    if (
      user &&
      (await this.comparePasswords(signInDto.password, user.password))
    ) {
      const payload = {
        user: ResponseUserDto.factory(user),
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
        userId: user.userId,
        name: user.name,
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
