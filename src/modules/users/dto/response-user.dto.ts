import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { User } from '../entities/user.entity';

export class ResponseUserDto {
  @Expose()
  @ApiProperty({ example: '1' })
  userId: number;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'john-doe@email.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: new Date() })
  updatedAt?: Date;

  static factory(user: User): ResponseUserDto {
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
