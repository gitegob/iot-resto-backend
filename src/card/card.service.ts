import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { JwtPayload, RestoPayload } from 'src/_shared_/interfaces';
import { TransactionType } from 'src/_shared_/interfaces/enums.interface';
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

  async findRestoTransactions(resto: RestoPayload) {
    return {
      message: 'All transactions retrieved',
      data: await this.transactionRepo.find({ where: { resto } }),
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

  async rechargeBalance(user: JwtPayload, uid: string, amount: number) {
    const card = await this.cardRepo.findOne({ where: { uid } });
    if (!card) throw new NotFoundException('This card does not exist');
    card.balance = card.balance - amount;
    await this.cardRepo.save(card);

    const newTransaction = new Transaction();
    newTransaction.card = card;
    newTransaction.cardUid = card.uid;
    newTransaction.type = TransactionType.RECHARGE;
    newTransaction.amount = amount;
    newTransaction.agent = user as any;
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
