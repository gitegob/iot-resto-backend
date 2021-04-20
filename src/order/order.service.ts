import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableService } from '../table/table.service';
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
    const newOrder = new Order();
    newOrder.table = table;
    if (createOrderDto?.status) newOrder.status = createOrderDto.status;
    await this.orderRepo.save(newOrder);
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
    await this.findOne(id);
    this.orderRepo.update({ id }, updateOrderDto);
    return {};
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.orderRepo.delete(id);
    return {};
  }
}
