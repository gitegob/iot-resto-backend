import { Order } from '../../order/entities/order.entity';

export const orderPrice = (order: Order) =>
  order.items.reduce((t, n) => t + n.item.price * n.quantity, 0);
