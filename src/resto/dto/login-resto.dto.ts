import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRestoDto {
  @IsString()
  @ApiProperty({ default: 'resto1' })
  name: string;
  @IsString()
  @ApiProperty({ default: 'Password' })
  password: string;
}
