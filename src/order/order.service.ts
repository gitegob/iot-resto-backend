import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as prettyMilliseconds from 'pretty-ms';
import { FindOneOptions, Repository } from 'typeorm';
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
  async create(tableId: string, user: any) {
    const { data: table } = await this.tableService.findOne({
      where: { id: tableId, status: TableStatus.FREE },
    });
    let newOrder = new Order();
    newOrder.table = table;
    newOrder.status = OrderStatus.PENDING;
    newOrder.waiter = user;
    await this.tableService.saveTable(table);
    newOrder = await this.orderRepo.save(newOrder);
    return { data: newOrder };
  }

  async confirm(orderId: string) {
    const { data: order } = await this.findOne({
      where: { id: orderId, status: OrderStatus.PENDING },
    });
    order.status = OrderStatus.CONFIRMED;
    order.timeConfirmed = new Date();
    await this.orderRepo.save(order);
    return { data: order };
  }

  async finish(orderId: string) {
    let { data: order } = await this.findOne({
      where: { id: orderId, isPaid: true, status: OrderStatus.CONFIRMED },
      relations: ['table'],
    });
    const { data: table } = await this.tableService.findOne({
      where: { id: order.table.id },
    });
    order.status = OrderStatus.SERVED;
    order.timeConfirmedToServed = prettyMilliseconds(
      new Date().getTime() - order.timeConfirmed.getTime(),
    );
    table.status = TableStatus.FREE;
    await this.tableService.saveTable(table);
    order = await this.orderRepo.save(order);
    delete order.table;
    return { data: order };
  }

  async pay(orderId: string, payOrderDto: PayOrderDto) {
    const { data: order } = await this.findOne({
      where: { id: orderId, isPaid: false, status: OrderStatus.CONFIRMED },
      relations: ['table'],
    });
    const { data: table } = await this.tableService.findOne({
      where: { id: order.table.id },
    });
    order.paidPrice = payOrderDto.price;
    order.isPaid = true;
    table.status = TableStatus.WAITING;
    await this.tableService.saveTable(table);
    await this.orderRepo.save(order);
    delete order.table;
    return { data: order };
  }

  async findAll(tableId: string | undefined) {
    if (!tableId)
      return { data: await this.orderRepo.find({ relations: ['table'] }) };
    return {
      data: await this.orderRepo.find({ where: { table: tableId } }),
    };
  }

  async findPaidConfirmed() {
    return {
      data: await this.orderRepo.find({
        where: { isPaid: true, status: OrderStatus.CONFIRMED },
        relations: ['table', 'waiter'],
        order: { dateCreated: 'DESC' },
      }),
    };
  }

  async findOne(options?: FindOneOptions<Order>) {
    const order = await this.orderRepo.findOne(options);
    if (!order) throw new NotFoundException('order not found');
    else return { data: order };
  }

  async cancel(id: string) {
    await this.findOne({
      where: { id, status: OrderStatus.PENDING },
    });
    await this.orderRepo.delete(id);
    return { message: 'Order cancelled' };
  }

  async saveOrder(orderInstance: Order): Promise<void> {
    await this.orderRepo.save(orderInstance);
  }
}
