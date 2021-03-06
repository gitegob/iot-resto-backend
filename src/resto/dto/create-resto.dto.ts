import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsString } from 'class-validator';

export class CreateRestoDto {
  @IsString()
  @ApiProperty({ default: 'resto1' })
  name: string;
  @IsString()
  @ApiProperty({ default: 'Password' })
  password: string;
  @Allow()
  @ApiProperty({ default: true })
  active: boolean;
}
