import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ name: 'username' })
  username: string;

  @IsString()
  @ApiProperty({ name: 'password' })
  password: string;
}
