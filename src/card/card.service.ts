import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { OrderStatus } from 'src/_shared_/interfaces/enum.interface';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepo: Repository<Card>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const newCard = new Card();
    newCard.owner = createCardDto.owner;
    newCard.uid = createCardDto.uid;
    await this.cardRepo.save(newCard);
    return { message: 'Card created', data: newCard };
  }

  async findAll() {
    return { message: 'Cards retrieved', data: await this.cardRepo.find() };
  }

  async findOneCard(uid: string) {
    const card = await this.cardRepo.findOne({ where: { uid } });
    if (!card) throw new NotFoundException('This card does not exist');
    return { message: 'Single card retrieved', data: card };
  }

  async deductBalance(uid: string, orderId: string, amount: number) {
    const order = await this.orderRepo.findOne({
      id: orderId,
      isPaid: false,
      status: OrderStatus.CONFIRMED,
    });
    if (!order) throw new NotFoundException('Order not found');
    const card = await this.cardRepo.findOne({ where: { uid } });
    if (!card) throw new NotFoundException('This card does not exist');
    if (card.balance < amount)
      throw new BadRequestException(
        `Your card balance is not enough. Balance is: ${card.balance}`,
      );
    card.balance = card.balance - order.price;
    await this.cardRepo.save(card);
    order.isPaid = true;
    order.paidPrice = order.price;
    await this.orderRepo.save(order);

    return {
      message: 'Success',
      data: {
        deducted: order.price,
        balance: card.balance,
      },
    };
  }

  async rechargeBalance(uid: string, amount: number) {
    const card = await this.cardRepo.findOne({ where: { uid } });
    if (!card) throw new NotFoundException('This card does not exist');
    card.balance = card.balance - amount;
    await this.cardRepo.save(card);
    return {
      message: 'Card recharged',
      data: {
        recharged: amount,
        balance: card.balance,
      },
    };
  }

  async remove(uid: string) {
    const card = await this.cardRepo.findOne({ where: { uid } });
    if (!card) throw new NotFoundException('This card does not exist');
    await this.cardRepo.delete({ uid });
    return { message: 'Card deleted' };
  }
}
