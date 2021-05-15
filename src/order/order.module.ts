import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { TableModule } from '../table/table.module';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { Item } from '../item/entities/item.entity';
import { Transaction } from 'src/card/entities/transaction.entity';
import { Card } from 'src/card/entities/card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Item, Transaction, Card]),
    TableModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
