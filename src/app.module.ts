import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { TableModule } from './table/table.module';
import ormconfig from '../ormconfig';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ExceptionsFilter } from './_shared_/filters/exceptions.filter';
import { ResponseInterceptor } from './_shared_/interceptors/response.interceptor';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ItemModule,
    TableModule,
    OrderModule,
    OrderItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    MessagesGateway,
  ],
})
export class AppModule {}
