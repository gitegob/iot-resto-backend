import { IsNumber, IsOptional, Max } from 'class-validator';
import { TableStatus } from '../../_shared_/interfaces/enum.interface';

export class CreateTableDto {
  @IsNumber()
  @Max(1000)
  number: number;

  @IsOptional()
  status: TableStatus;
}
