import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { TableModule } from './table/table.module';
import ormconfig from '../ormconfig';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './_shared_/interceptors/response.interceptor';
import { ExceptionsFilter } from './_shared_/filters/exceptions.filter';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), ItemModule, TableModule],
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
  ],
})
export class AppModule {}
