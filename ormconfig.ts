import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from './src/env';
import { Item } from './src/item/entities/item.entity';
import { OrderItem } from './src/order-item/entities/order-item.entity';
import { Order } from './src/order/entities/order.entity';
import { Table } from './src/table/entities/table.entity';

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.NODE_ENV === 'test' ? env.POSTGRES_TEST_DB : env.POSTGRES_DB,
  entities: [Item, Table, Order, OrderItem],
  synchronize: env.NODE_ENV !== 'production',
  migrations: ['dist/src/db/migrations/*.js'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
  ssl:
    env.DATABASE_SSL === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : false,
};
export default ormconfig;
