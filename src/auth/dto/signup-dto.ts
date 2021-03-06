import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { RegisterRole, Role } from '../../_shared_/interfaces/enums.interface';

export class SignupDto {
  @IsString()
  @ApiProperty({ name: 'firstName' })
  firstName: string;
  @IsString()
  @ApiProperty({ name: 'lastName' })
  lastName: string;
  @IsString()
  @IsEnum(RegisterRole)
  @ApiProperty({ name: 'role', enum: RegisterRole })
  role: Role;
  @IsString()
  @ApiProperty({ name: 'username' })
  username: string;
  @IsString()
  @ApiProperty({ name: 'password' })
  password: string;
}
