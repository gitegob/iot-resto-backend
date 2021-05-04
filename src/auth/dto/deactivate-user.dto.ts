import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class DeactivateUserDto {
  @IsString()
  @ApiProperty({ default: 'gbrian' })
  username: string;
}
