import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableService } from '../table/table.service';
import {
  OrderStatus,
  TableStatus,
} from '../_shared_/interfaces/enum.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly tableService: TableService,
  ) {}
  async create(createOrderDto: CreateOrderDto, tableId: string) {
    const { data: table } = await this.tableService.findOne(tableId);
    table.status = TableStatus.WAITING;
    const newOrder = new Order();
    newOrder.table = table;
    if (createOrderDto?.status) newOrder.status = createOrderDto.status;
    await this.orderRepo.save(newOrder);
    await this.tableService.save(table);
    return { data: newOrder };
  }

  async findAll(tableId: string | undefined) {
    if (!tableId) return { data: await this.orderRepo.find() };
    return { data: await this.orderRepo.find({ where: { table: tableId } }) };
  }

  async findOne(options: string | any) {
    const order = await this.orderRepo.findOne(options);
    if (!order) throw new NotFoundException('order not found');
    else return { data: order };
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne({
      where: [
        { id, status: OrderStatus.PENDING },
        { id, status: OrderStatus.FINISHED },
      ],
    });
    this.orderRepo.update({ id }, updateOrderDto);
    return {};
  }

  async finishOrder(id: string) {
    const { data: order } = await this.findOne(id);
    const { data: table } = await this.tableService.findOne(order.table);
    order.status = OrderStatus.FINISHED;
    table.status = TableStatus.SERVING;
    await this.orderRepo.save(order);
    await this.tableService.save(table);
    return {};
  }

  async payOrder(id: string) {
    const { data: order } = await this.findOne(id);
    const { data: table } = await this.tableService.findOne(order.table);
    order.status = OrderStatus.PAID;
    table.status = TableStatus.SERVING;
    await this.orderRepo.save(order);
    await this.tableService.save(table);
    return {};
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.orderRepo.delete(id);
    return {};
  }

  async save(orderInstance: Order): Promise<void> {
    await this.orderRepo.save(orderInstance);
  }
}
