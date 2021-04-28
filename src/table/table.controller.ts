import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { QueryParamsDto } from '../_shared_/dto/query-params.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { TableStatusQuery } from '../_shared_/interfaces/enum.interface';

@ApiTags('Tables')
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  @ApiQuery({ name: 'ts', enum: TableStatusQuery })
  findAll(@Query() q: QueryParamsDto) {
    return this.tableService.findAll(q.ts);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tableService.findTable(id);
  }

  @Get(':id/orders')
  findTableOrders(@Param('id', ParseUUIDPipe) id: string) {
    return this.tableService.findTableOrders(id);
  }
  @Get(':id/orders/unpaid')
  getLatestOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.tableService.getUnpaidOrders(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tableService.remove(id);
  }
}
