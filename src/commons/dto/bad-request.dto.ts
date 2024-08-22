import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
  @ApiProperty()
  statusCode: 400;

  @ApiProperty()
  message: string[];

  @ApiProperty()
  error: string;
}
