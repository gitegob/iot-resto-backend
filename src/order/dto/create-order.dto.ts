import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

interface OrderItemQty {
  itemId: string;
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ApiProperty({
    default: [
      {
        itemId: '1',
        quantity: 5,
      },
      {
        itemId: '2',
        quantity: 3,
      },
    ],
  })
  items: OrderItemQty[];
}
