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
    createOrderItemDtos: CreateOrderItemDto[],
    orderId: any,
    itemId: any,
  ) {
    const { data: order } = await this.orderService.findOne({
      where: { order: orderId, status: OrderStatus.PENDING },
    });
    const orderItems = createOrderItemDtos.map(async (createOrderItemDto) => {
      const { data: item } = await this.itemService.findOne(itemId);
      const newOrderItem = new OrderItem();
      newOrderItem.item = item;
      newOrderItem.order = order;
      newOrderItem.name = createOrderItemDto.name;
      newOrderItem.quantity = createOrderItemDto.quantity;
      await this.orderItemRepo.save(newOrderItem);
      return newOrderItem;
    });
    order.price = orderPrice(order);
    await this.orderService.save(order);
    return { data: orderItems };
  }

  async findAll(orderId: string | undefined) {
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

  async save(orderItemInstance: OrderItem): Promise<void> {
    await this.orderItemRepo.save(orderItemInstance);
  }
}
