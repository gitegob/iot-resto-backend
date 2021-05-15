import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestoPayload } from 'src/_shared_/interfaces';
import { ILike, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
  ) {}
  async create(resto: RestoPayload, createItemDto: CreateItemDto) {
    const newItem = new Item();
    newItem.name = createItemDto.name;
    newItem.description = createItemDto.description;
    newItem.price = createItemDto.price;
    newItem.picture = createItemDto.picture;
    newItem.resto = resto as any;
    await this.itemRepo.save(newItem);
    return { data: newItem };
  }

  async findAll(resto: RestoPayload) {
    return {
      data: await this.itemRepo.find({ where: { resto } }),
    };
  }

  async search(resto: RestoPayload, s: string) {
    return {
      data: await this.itemRepo.find({
        where: { resto, name: ILike(`%${s}%`) },
      }),
    };
  }

  async findOneItem(resto: RestoPayload, id: string) {
    return {
      data: await this.findOne({
        where: { resto, id },
        relations: ['orderedItems'],
      }),
    };
  }
  async findOne(options: string | any) {
    const item = await this.itemRepo.findOne(options);
    if (!item) throw new NotFoundException('Item not found');
    else return { data: item };
  }

  async update(resto: RestoPayload, id: string, updateItemDto: UpdateItemDto) {
    await this.findOne({ where: { id, resto } });
    this.itemRepo.update({ id }, updateItemDto);
    return {};
  }

  async remove(resto: RestoPayload, id: string) {
    await this.findOne({ where: { id, resto } });
    await this.itemRepo.delete(id);
    return { message: 'Success' };
  }

  async saveItem(itemInstance: Item): Promise<void> {
    await this.itemRepo.save(itemInstance);
  }
}
