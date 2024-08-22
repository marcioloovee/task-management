import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class signInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'john-doe@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  password: string;
}
