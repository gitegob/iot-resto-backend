import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as prettyMilliseconds from 'pretty-ms';
import { Repository } from 'typeorm';
import { TableService } from '../table/table.service';
import {
  OrderStatus,
  TableStatus,
} from '../_shared_/interfaces/enum.interface';
import { PayOrderDto } from './dto/pay-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly tableService: TableService,
  ) {}
  async create(tableId: string) {
    const { data: table } = await this.tableService.findOne({
      where: [
        { id: tableId, status: TableStatus.FREE },
        { id: tableId, status: TableStatus.SERVED },
      ],
    });
    table.status = TableStatus.WAITING;
    const newOrder = new Order();
    newOrder.table = table;
    newOrder.status = OrderStatus.PENDING;
    await this.orderRepo.save(newOrder);
    await this.tableService.saveTable(table);
    return { data: newOrder };
  }

  async accept(orderId: string) {
    const { data: order } = await this.findOne({
      where: { id: orderId, status: OrderStatus.PENDING },
      relations: ['table'],
    });
    const { data: table } = await this.tableService.findOne(order.table.id);
    order.status = OrderStatus.ACCEPTED;
    order.timeCreatedToAccepted = prettyMilliseconds(
      new Date().getTime() - order.dateCreated.getTime(),
    );
    table.status = TableStatus.SERVING;
    await this.orderRepo.save(order);
    await this.tableService.saveTable(table);
    return { data: order };
  }

  async confirm(orderId: string) {
    const { data: order } = await this.findOne({
      where: { id: orderId, status: OrderStatus.ACCEPTED },
    });
    order.status = OrderStatus.CONFIRMED;
    order.timeConfirmed = new Date();
    await this.orderRepo.save(order);
    return { data: order };
  }

  async finish(orderId: string) {
    let { data: order } = await this.findOne({
      where: { id: orderId, status: OrderStatus.CONFIRMED },
      relations: ['table'],
    });
    const { data: table } = await this.tableService.findOne(order.table.id);
    order.status = OrderStatus.SERVED;
    order.timeConfirmedToFinished = prettyMilliseconds(
      new Date().getTime() - order.timeConfirmed.getTime(),
    );
    table.status = TableStatus.SERVED;
    await this.tableService.saveTable(table);
    order = await this.orderRepo.save(order);
    return { data: order };
  }

  async pay(orderId: string, payOrderDto: PayOrderDto) {
    let { data: order } = await this.findOne({
      where: { id: orderId, status: OrderStatus.SERVED },
      relations: ['table'],
    });
    const { data: table } = await this.tableService.findOne(order.table.id);
    order.paidPrice = payOrderDto.price;
    order.isPaid = true;
    table.status = TableStatus.FREE;
    await this.tableService.saveTable(table);
    order = await this.orderRepo.save(order);
    return { data: order };
  }

  async findAll(tableId: string | undefined) {
    if (!tableId)
      return { data: await this.orderRepo.find({ relations: ['table'] }) };
    return { data: await this.orderRepo.find({ where: { table: tableId } }) };
  }

  async findOne(options: string | any) {
    const order = await this.orderRepo.findOne(options);
    if (!order) throw new NotFoundException('order not found');
    else return { data: order };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.orderRepo.delete(id);
    return {};
  }

  async saveOrder(orderInstance: Order): Promise<void> {
    await this.orderRepo.save(orderInstance);
  }
}
