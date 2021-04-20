import { IsNumber, Max } from 'class-validator';

export class CreateTableDto {
  @IsNumber()
  @Max(1000)
  number: number;
}
