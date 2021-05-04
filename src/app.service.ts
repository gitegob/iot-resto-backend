import { Injectable } from '@nestjs/common';
import { CardDto } from './_shared_/dto/card.dto';
@Injectable()
export class AppService {
  getHello() {
    return { message: 'Hello World!' };
  }
  sendCardId(card: CardDto) {
    return { message: 'Hello bruh, this below is your card id', data: card.id };
  }
}
