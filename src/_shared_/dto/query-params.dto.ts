import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TableStatus } from '../interfaces/enum.interface';

export class QueryParamsDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsUUID()
  @IsOptional()
  tableId: string;

  @IsUUID()
  @IsOptional()
  orderId: string;

  @IsUUID()
  @IsOptional()
  itemId: string;

  @IsString()
  @IsEnum(TableStatus)
  @IsOptional()
  status: TableStatus;

  @IsOptional()
  s: string;
}
