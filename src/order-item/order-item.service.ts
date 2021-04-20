import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}
  async create(
    createOrderItemDto: CreateOrderItemDto /* , order: any, item: any */,
  ) {
    const newOrderItem = new OrderItem();
    newOrderItem.quantity = createOrderItemDto.quantity;
    await this.orderItemRepo.save(newOrderItem);
    return { data: newOrderItem };
  }

  async findAll() {
    return { data: await this.orderItemRepo.find() };
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
