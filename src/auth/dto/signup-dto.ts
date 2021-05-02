import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Role } from '../../_shared_/interfaces/enum.interface';

export class SignupDto {
  @IsString()
  @ApiProperty({ name: 'firstName' })
  firstName: string;
  @IsString()
  @ApiProperty({ name: 'lastName' })
  lastName: string;
  @IsString()
  @IsEnum(Role)
  @ApiProperty({ name: 'role', enum: Role })
  role: Role;
  @IsString()
  @ApiProperty({ name: 'username' })
  username: string;
  @IsString()
  @ApiProperty({ name: 'password' })
  password: string;
}
