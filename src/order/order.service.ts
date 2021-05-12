import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as prettyMilliseconds from 'pretty-ms';
import { Card } from 'src/card/entities/card.entity';
import { Transaction } from 'src/card/entities/transaction.entity';
import { JwtPayload, RestoPayload } from 'src/_shared_/interfaces';
import { FindOneOptions, Repository } from 'typeorm';
import { Item } from '../item/entities/item.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { TableService } from '../table/table.service';
import {
  OrderStatus,
  TableStatus,
  TransactionType,
} from '../_shared_/interfaces/enums.interface';
import { orderPrice } from '../_shared_/utils';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Card) private readonly cardRepo: Repository<Card>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    private readonly tableService: TableService,
  ) {}
  async create(
    resto: RestoPayload,
    user: JwtPayload,
    tableId: string,
    createOrderDto: CreateOrderDto,
  ) {
    const { data: table } = await this.tableService.findOne({
      where: { id: tableId, resto, status: TableStatus.FREE },
    });
    let newOrder = new Order();
    newOrder.table = table;
    newOrder.status = OrderStatus.PENDING;
    newOrder.waiter = user as any;
    newOrder.resto = resto as any;
    newOrder = await this.orderRepo.save(newOrder);
    for (const it of createOrderDto.items) {
      const item = await this.itemRepo.findOne(it.itemId);
      const newOrderItem = new OrderItem();
      newOrderItem.item = it.itemId as any;
      newOrderItem.order = newOrder.id as any;
      newOrderItem.name = item.name;
      newOrderItem.quantity = it.quantity;
      newOrderItem.price = item.price * it.quantity;
      newOrderItem.resto = resto as any;
      await this.orderItemRepo.save(newOrderItem);
    }
    newOrder = await this.orderRepo.findOne({
      where: { id: newOrder.id },
      relations: ['orderItems'],
    });
    newOrder.price = orderPrice(newOrder.orderItems);
    await this.orderRepo.save(newOrder);
    return { data: newOrder };
  }

  async findAllOrders(resto: RestoPayload) {
    return {
      message: 'Success',
      data: await this.orderRepo.find({ where: { resto } }),
    };
  }

  async confirm(resto: RestoPayload, orderId: string) {
    const { data: order } = await this.findOne({
      where: { id: orderId, resto, status: OrderStatus.PENDING },
    });
    order.status = OrderStatus.CONFIRMED;
    order.timeConfirmed = new Date();
    await this.orderRepo.save(order);
    return { data: order };
  }

  async finish(resto: RestoPayload, orderId: string) {
    let { data: order } = await this.findOne({
      where: {
        id: orderId,
        resto,
        isPaid: true,
        status: OrderStatus.CONFIRMED,
      },
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

  async pay(resto: RestoPayload, user: JwtPayload, uid: string) {
    const card = await this.cardRepo.findOne({ where: { uid } });
    if (!card) throw new NotFoundException('This card does not exist');
    const order = (
      await this.orderRepo.find({
        where: {
          resto,
          waiter: user,
          isPaid: false,
          status: OrderStatus.CONFIRMED,
        },
        relations: ['table'],
        order: { dateCreated: 'DESC' },
      })
    )[0];
    if (!order) throw new NotFoundException('This order does not exist');
    const { data: table } = await this.tableService.findOne({
      where: { id: order.table.id },
    });
    if (card.balance < order.price)
      throw new BadRequestException(
        `Balance of ${card.balance} Not enough for this transaction`,
      );
    card.balance = card.balance - order.price;
    order.paidPrice = order.price;
    order.isPaid = true;
    const newTransaction = new Transaction();
    newTransaction.type = TransactionType.PAYMENT;
    newTransaction.amount = order.paidPrice;
    newTransaction.card = card;
    newTransaction.cardUid = uid;
    newTransaction.resto = resto as any;
    table.status = TableStatus.WAITING;
    await this.tableService.saveTable(table);
    await this.orderRepo.save(order);
    await this.cardRepo.save(card);
    await this.transactionRepo.save(newTransaction);
    delete order.table;
    return { data: { order, paid: order.paidPrice, balance: card.balance } };
  }

  async findAll(resto: RestoPayload, tableId: string | undefined) {
    if (!tableId)
      return {
        data: await this.orderRepo.find({
          where: { resto },
          relations: ['table'],
        }),
      };
    return {
      data: await this.orderRepo.find({ where: { table: tableId } }),
    };
  }

  async findPaidConfirmed(resto: RestoPayload) {
    return {
      data: await this.orderRepo.find({
        where: { resto, isPaid: true, status: OrderStatus.CONFIRMED },
        relations: ['table', 'waiter', 'orderItems'],
        order: { dateCreated: 'DESC' },
      }),
    };
  }

  async findOne(options?: FindOneOptions<Order>) {
    const order = await this.orderRepo.findOne(options);
    if (!order) throw new NotFoundException('order not found');
    else return { data: order };
  }

  async delete(resto: RestoPayload, id: string) {
    await this.findOne({
      where: { id, resto, status: OrderStatus.PENDING },
    });
    await this.orderRepo.delete(id);
    return { message: 'Order cancelled' };
  }

  async saveOrder(orderInstance: Order): Promise<void> {
    await this.orderRepo.save(orderInstance);
  }
}
