import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeactivateUserDto {
  @IsString()
  @ApiProperty({ default: 'gbrian' })
  username: string;
}
