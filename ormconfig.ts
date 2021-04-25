import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Item } from './src/item/entities/item.entity';
import { OrderItem } from './src/order-item/entities/order-item.entity';
import { Order } from './src/order/entities/order.entity';
import { Table } from './src/table/entities/table.entity';
import { db, global } from './src/_shared_/config/env.config';

const ormconfig: TypeOrmModuleOptions = {
  ...db,
  type: 'postgres',
  port: 5432,
  entities: [Item, Table, Order, OrderItem],
  synchronize: global.nodeEnv !== 'production',
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
