import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  @Max(1000)
  @ApiProperty({
    default: 5,
  })
  quantity: number;
}
