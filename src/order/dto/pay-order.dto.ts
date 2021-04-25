import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PayOrderDto {
  @IsNumber()
  @ApiProperty({ default: 15000 })
  price: number;
}
