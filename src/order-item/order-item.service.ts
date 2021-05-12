import { orderPrice } from '../_shared_/utils/index';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemService } from '../item/item.service';
import { OrderService } from '../order/order.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from '../_shared_/interfaces/enums.interface';
import { RestoPayload } from 'src/_shared_/interfaces';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly orderService: OrderService,
    private readonly itemService: ItemService,
  ) {}
  async create(
    resto: RestoPayload,
    createOrderItemDto: CreateOrderItemDto,
    orderId: string,
    itemId: string,
  ): Promise<any> {
    const { data: order } = await this.orderService.findOne({
      where: { id: orderId, resto, status: OrderStatus.PENDING },
    });
    const { data: item } = await this.itemService.findOne({
      where: { id: itemId, resto },
    });
    const newOrderItem = new OrderItem();
    newOrderItem.order = order;
    newOrderItem.item = item;
    newOrderItem.name = item.name;
    newOrderItem.quantity = createOrderItemDto.quantity;
    newOrderItem.price = item.price * newOrderItem.quantity;
    newOrderItem.resto = resto as any;
    await this.orderItemRepo.save(newOrderItem);
    const orderItems = await this.orderItemRepo.find({
      where: { resto, order },
    });
    order.price = orderPrice(orderItems);
    await this.orderService.saveOrder(order);
    return {
      data: {
        order: (
          await this.orderService.findOne({
            where: { id: orderId, resto },
            relations: ['orderItems'],
          })
        ).data,
      },
    };
  }

  async findByOrder(
    resto: RestoPayload,
    orderId: string,
  ): Promise<{
    data: OrderItem[];
  }> {
    return {
      data: await this.orderItemRepo.find({ where: { resto, order: orderId } }),
    };
  }

  async findOne(options: string | any) {
    const orderItem = await this.orderItemRepo.findOne(options);
    if (!orderItem) throw new NotFoundException('order item not found');
    else return { data: orderItem };
  }

  async remove(resto: RestoPayload, id: string) {
    await this.findOne({ where: { id, resto } });
    await this.orderItemRepo.delete(id);
    return {};
  }

  async saveOrderItem(orderItemInstance: OrderItem): Promise<void> {
    await this.orderItemRepo.save(orderItemInstance);
  }
}
