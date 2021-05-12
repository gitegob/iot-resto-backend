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
import { ApiBearerAuth, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Role, TableStatusQuery } from '../_shared_/interfaces/enums.interface';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RestoGuard } from '../auth/guards/resto.guard';
import { Roles } from '../_shared_/decorators/role.decorator';
import { RestoDec } from 'src/_shared_/decorators/resto.decorator';
import { RestoPayload } from 'src/_shared_/interfaces';

@Controller('tables')
@ApiSecurity('api_key', ['api_key'])
@ApiBearerAuth()
@UseGuards(RestoGuard, JwtGuard)
@ApiTags('Tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  create(
    @RestoDec() resto: RestoPayload,
    @Body() createTableDto: CreateTableDto,
  ) {
    return this.tableService.create(resto, createTableDto);
  }

  @Get()
  @ApiQuery({ name: 'status', enum: TableStatusQuery })
  findAll(
    @RestoDec() resto: RestoPayload,
    @Query('status') status: TableStatusQuery,
  ) {
    return this.tableService.findAll(resto, status);
  }

  @Get(':id')
  findOne(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.tableService.findTable(resto, id);
  }

  @Get(':id/orders')
  findTableOrders(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.tableService.findTableOrders(resto, id);
  }
  @Get(':id/orders/unpaid')
  getLatestOrder(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.tableService.getUnpaidOrders(resto, id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  remove(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.tableService.remove(resto, id);
  }
}
