import { Logger, Module } from '@nestjs/common';
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
import { AuthModule } from './auth/auth.module';
import { LoggerInterceptor } from './_shared_/interceptors/logger.interceptor';
import { RestoModule } from './resto/resto.module';
import { CardModule } from './card/card.module';
import { JsonWebTokenModule } from './jsonwebtoken/jsonwebtoken.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ItemModule,
    TableModule,
    OrderModule,
    OrderItemModule,
    AuthModule,
    RestoModule,
    CardModule,
    JsonWebTokenModule,
  ],
  controllers: [AppController],
  providers: [
    Logger,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}
