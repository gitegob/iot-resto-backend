import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CardDto } from './_shared_/dto/card.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('home')
  getHello() {
    return this.appService.getHello();
  }
  @Post('card')
  sendCardId(@Body() card: CardDto) {
    return this.appService.sendCardId(card);
  }
}
