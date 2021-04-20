import { Allow } from 'class-validator';
import { OrderStatus } from '../../_shared_/interfaces/enum.interface';

export class CreateOrderDto {
  @Allow()
  status: OrderStatus;
}
