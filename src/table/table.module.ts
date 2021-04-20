import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';

@Module({
  controllers: [TableController],
  providers: [TableService]
})
export class TableModule {}
