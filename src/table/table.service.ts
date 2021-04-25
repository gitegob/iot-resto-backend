import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { TableStatusQuery } from '../_shared_/interfaces/enum.interface';
import { sortStuffByDate } from '../_shared_/utils';
import { CreateTableDto } from './dto/create-table.dto';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table) private readonly tableRepo: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto) {
    const table = await this.tableRepo.findOne({
      where: { number: createTableDto.number },
    });
    if (table) throw new ConflictException('Table already exists');
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
  async getUnpaidOrders(tableId: string) {
    const { data: table } = await this.findOne({
      where: { id: tableId },
      relations: ['orders'],
    });
    const orders = sortStuffByDate<Order>(
      table.orders.filter((o) => o.isPaid === false),
    );
    return { data: { table: table.number, unpaid: orders } };
  }
  async findTable(id: string) {
    const { data: table } = await this.findOne({
      where: { id },
      relations: ['orders'],
    });
    return { data: table };
  }
  async findTableOrders(tableId: string) {
    const { data: table } = await this.findOne({
      where: { id: tableId },
      relations: ['orders'],
    });
    const orders = sortStuffByDate(table.orders);
    return {
      data: { table: table.number, orders },
    };
  }
  async findOne(options: FindOneOptions<Table>) {
    const table = await this.tableRepo.findOne(options);
    if (!table) throw new NotFoundException('table not found');
    else return { data: table };
  }

  async remove(id: string) {
    await this.findOne({ where: { id } });
    await this.tableRepo.delete(id);
    return { message: 'Table deleted' };
  }

  async saveTable(tableInstance: Table): Promise<void> {
    await this.tableRepo.save(tableInstance);
  }
}
