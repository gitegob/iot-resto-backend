import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderModule } from '../order/order.module';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem]), OrderModule, ItemModule],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
