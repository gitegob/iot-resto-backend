import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TableStatusQuery } from '../interfaces/enum.interface';

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
  @IsEnum(TableStatusQuery)
  @IsOptional()
  ts: TableStatusQuery;

  @IsOptional()
  s: string;
}
