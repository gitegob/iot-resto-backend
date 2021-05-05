import { Allow, IsString } from 'class-validator';

export class CreateRestoDto {
  @IsString()
  restoname: string;
  @IsString()
  password: string;
  @Allow()
  active: boolean;
}
