import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from '../_shared_/config/env.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Table]),
    JwtModule.register({
      secret: jwt.secret,
    }),
  ],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
