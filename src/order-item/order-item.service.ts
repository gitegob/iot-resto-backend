import { orderPrice } from '../_shared_/utils/index';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemService } from '../item/item.service';
import { OrderService } from '../order/order.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from '../_shared_/interfaces/enum.interface';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly orderService: OrderService,
    private readonly itemService: ItemService,
  ) {}
  async create(
    createOrderItemDto: CreateOrderItemDto,
    orderId: any,
    itemId: any,
  ): Promise<{ data: OrderItem }> {
    const order = (
      await this.orderService.findOne({
        where: [
          { id: orderId, status: OrderStatus.PENDING },
          { id: orderId, status: OrderStatus.CONFIRMED },
        ],
        relations: ['items'],
      })
    ).data;
    const { data: item } = await this.itemService.findOne(itemId);
    const newOrderItem = new OrderItem();
    newOrderItem.item = item;
    newOrderItem.order = order;
    newOrderItem.name = item.name;
    newOrderItem.quantity = createOrderItemDto.quantity;
    const orderItem = await this.orderItemRepo.save(newOrderItem);
    const orderItems = await this.orderItemRepo.find({
      where: { order },
      relations: ['item'],
    });
    order.price = orderPrice(orderItems);
    await this.orderService.saveOrder(order);
    return { data: orderItem };
  }

  async findAll(
    orderId: string | undefined,
  ): Promise<{
    data: OrderItem[];
  }> {
    if (!orderId) return { data: await this.orderItemRepo.find() };
    return {
      data: await this.orderItemRepo.find({ where: { order: orderId } }),
    };
  }

  async findOne(options: string | any) {
    const orderItem = await this.orderItemRepo.findOne(options);
    if (!orderItem) throw new NotFoundException('order item not found');
    else return { data: orderItem };
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    await this.findOne(id);
    this.orderItemRepo.update({ id }, updateOrderItemDto);
    return {};
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.orderItemRepo.delete(id);
    return {};
  }

  async saveOrderItem(orderItemInstance: OrderItem): Promise<void> {
    await this.orderItemRepo.save(orderItemInstance);
  }
}
