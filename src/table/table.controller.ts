import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, TableStatusQuery } from '../_shared_/interfaces/enum.interface';
import { JwtGuard } from '../_shared_/guards/jwt.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../_shared_/guards/roles.guard';

@Controller('tables')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  @ApiQuery({ name: 'status', enum: TableStatusQuery })
  findAll(@Query('status') status: TableStatusQuery) {
    return this.tableService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.tableService.findTable(id);
  }

  @Get(':id/orders')
  findTableOrders(@Param('id', ParseIntPipe) id: string) {
    return this.tableService.findTableOrders(id);
  }
  @Get(':id/orders/unpaid')
  getLatestOrder(@Param('id', ParseIntPipe) id: string) {
    return this.tableService.getUnpaidOrders(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.tableService.remove(id);
  }
}
