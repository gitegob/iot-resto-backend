import { OrderItem } from '../../order-item/entities/order-item.entity';
import { Order } from '../../order/entities/order.entity';

export function orderPrice(orderItems: OrderItem[]) {
  return orderItems.reduce((total, orderItem) => total + orderItem.price, 0);
}

export function sortStuffByDate<T extends Order>(stuff: T[]) {
  return stuff.sort((a, b) => {
    return b.dateCreated.getTime() - a.dateCreated.getTime();
  });
}
