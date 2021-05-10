import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
  @Get('card/test')
  sendCardId(@Query('uid') uid: string) {
    return this.appService.sendCardId(uid);
  }
}
