import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello() {
    return { message: 'Hello World!' };
  }
  sendCardId(uid: string) {
    return { message: 'Hello bruh, this below is your card id', data: uid };
  }
}
