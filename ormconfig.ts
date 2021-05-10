import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Card } from 'src/card/entities/card.entity';
import { Transaction } from 'src/card/entities/transaction.entity';
import { User } from './src/auth/entities/auth.entity';
import { Item } from './src/item/entities/item.entity';
import { OrderItem } from './src/order-item/entities/order-item.entity';
import { Order } from './src/order/entities/order.entity';
import { Resto } from './src/resto/entities/resto.entity';
import { Table } from './src/table/entities/table.entity';
import { db } from './src/_shared_/config/env.config';

const ormconfig: TypeOrmModuleOptions = {
  ...db,
  type: 'postgres',
  port: 5432,
  entities: [User, Item, Table, Order, OrderItem, Resto, Card, Transaction],
  synchronize: db.noSync ? false : true,
  migrations: ['dist/src/db/migrations/*.js'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  ssl:
    db.ssl === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : false,
};
export default ormconfig;
