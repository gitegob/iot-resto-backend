import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemService } from '../item/item.service';
import { OrderService } from '../order/order.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

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
    orderId: string,
    itemId: string,
  ) {
    const { data: order } = await this.orderService.findOne(orderId);
    const { data: item } = await this.itemService.findOne(itemId);
    const newOrderItem = new OrderItem();
    newOrderItem.item = item;
    newOrderItem.order = order;
    newOrderItem.quantity = createOrderItemDto.quantity;
    await this.orderItemRepo.save(newOrderItem);
    return { data: newOrderItem };
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
}
