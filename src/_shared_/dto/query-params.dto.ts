import { IsOptional, IsUUID } from 'class-validator';

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
}
