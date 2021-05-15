import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterAgentDto {
  @IsString()
  @ApiProperty({ name: 'firstName' })
  firstName: string;
  @IsString()
  @ApiProperty({ name: 'lastName' })
  lastName: string;
  @IsString()
  @ApiProperty({ name: 'username' })
  username: string;
  @IsString()
  @ApiProperty({ name: 'password' })
  password: string;
}
