import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import {
  OrderStatus,
  TableStatusQuery,
} from '../_shared_/interfaces/enum.interface';
import { sortStuffByDate } from '../_shared_/utils';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table) private readonly tableRepo: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto) {
    const newTable = new Table();
    newTable.number = createTableDto.number;
    await this.tableRepo.save(newTable);
    return { data: newTable };
  }

  async findAll(status: TableStatusQuery) {
    if (status === TableStatusQuery.ALL)
      return { data: await this.tableRepo.find() };
    return {
      data: await this.tableRepo.find({
        where: { status },
      }),
    };
  }
  async getUnpaidOrders(id: string) {
    const { data: table } = await this.findOne({
      where: { id },
      relations: ['orders'],
    });
    const orders = sortStuffByDate<Order>(
      table.orders.filter(
        (o) => o.isPaid === false && o.status === OrderStatus.SERVED,
      ),
    );
    return { data: orders };
  }
  async findTable(id: string) {
    const { data: table } = await this.findOne({
      where: { id },
      relations: ['orders'],
    });
    return { data: table };
  }
  async findTableOrders(id: string) {
    const { data: table } = await this.findOne({
      where: { id },
      relations: ['orders'],
    });
    const orders = sortStuffByDate(table.orders);
    return {
      data: { table: table.number, orders },
    };
  }
  async findOne(options: string | any) {
    const table = await this.tableRepo.findOne(options);
    if (!table) throw new NotFoundException('table not found');
    else return { data: table };
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    await this.findOne(id);
    this.tableRepo.update({ id }, updateTableDto);
    return {};
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.tableRepo.delete(id);
    return {};
  }

  async saveTable(tableInstance: Table): Promise<void> {
    await this.tableRepo.save(tableInstance);
  }
}
