import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import {
  OrderStatus,
  TransactionType,
} from 'src/_shared_/interfaces/enum.interface';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepo: Repository<Card>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async create(createCardDto: CreateCardDto) {
    const card = await this.cardRepo.findOne({
      where: { uid: createCardDto.uid },
    });
    if (card) throw new ConflictException('This card is already registered');
    const newCard = new Card();
    newCard.owner = createCardDto.owner;
    newCard.uid = createCardDto.uid;
    await this.cardRepo.save(newCard);
    return { message: 'Card created', data: newCard };
  }

  async findAll() {
    return { message: 'All cards retrieved', data: await this.cardRepo.find() };
  }

  async findAllTransactions() {
    return {
      message: 'All transactions retrieved',
      data: await this.transactionRepo.find(),
    };
  }

  async findSingleCardTransactions(cardUid: string) {
    return {
      message: 'All transactions retrieved',
      data: await this.transactionRepo.find({ where: { cardUid } }),
    };
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

    const newTransaction: any = new Transaction();
    newTransaction.card = card.id;
    newTransaction.cardUid = card.uid;
    newTransaction.type = TransactionType.DEDUCT;
    newTransaction.amount = order.price;
    await this.transactionRepo.save(newTransaction);

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

    const newTransaction: any = new Transaction();
    newTransaction.card = card.id;
    newTransaction.cardUid = card.uid;
    newTransaction.type = TransactionType.RECHARGE;
    newTransaction.amount = amount;
    await this.transactionRepo.save(newTransaction);

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
