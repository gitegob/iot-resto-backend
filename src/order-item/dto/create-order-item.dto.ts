import { IsNumber, Max } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @Max(1000)
  quantity: number;
}
