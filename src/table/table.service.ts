import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableStatus } from '../_shared_/interfaces/enum.interface';
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

  async findAll(status: TableStatus) {
    return {
      data: await this.tableRepo.find({
        where: { status },
        relations: ['orders'],
      }),
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

  async save(tableInstance: Table): Promise<void> {
    await this.tableRepo.save(tableInstance);
  }
}
