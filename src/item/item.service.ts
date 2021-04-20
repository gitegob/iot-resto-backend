import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemStatus } from '../_shared_/interfaces/enum.interface';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
  ) {}
  async create(createItemDto: CreateItemDto) {
    const newItem = new Item();
    newItem.name = createItemDto.name;
    newItem.price = createItemDto.price;
    await this.itemRepo.save(newItem);
    return { data: newItem };
  }

  async findAll() {
    return {};
  }

  async findOne(options: string | any) {
    const item = await this.itemRepo.findOne(options);
    if (!item) throw new NotFoundException('Item not found');
    else return { data: item };
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    await this.findOne(id);
    this.itemRepo.update({ id }, updateItemDto);
    return {};
  }

  async remove(id: string) {
    await this.itemRepo.delete(id);
    return {};
  }
}
