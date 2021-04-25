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
import { OrderService } from './order.service';
import { QueryParamsDto } from '../_shared_/dto/query-params.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { PayOrderDto } from './dto/pay-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   *
   * @param query tableId
   * @returns Order
   */
  @Post()
  @ApiQuery({ name: 'tableId' })
  create(@Query() q: QueryParamsDto) {
    return this.orderService.create(q.tableId);
  }

  /**
   *
   * @param query tableId
   * @returns Order[]
   */
  @Get()
  findAll(@Query() q: QueryParamsDto) {
    return this.orderService.findAll(q.tableId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne({
      where: { id },
      relations: ['items', 'table'],
    });
  }

  @Patch(':id/accept')
  accept(@Param('id', ParseUUIDPipe) id: string): Promise<{ data: Order }> {
    return this.orderService.accept(id);
  }

  @Patch(':id/confirm')
  confirm(@Param('id', ParseUUIDPipe) id: string): Promise<{ data: Order }> {
    return this.orderService.confirm(id);
  }

  @Patch(':id/finish')
  finish(@Param('id', ParseUUIDPipe) id: string): Promise<{ data: Order }> {
    return this.orderService.finish(id);
  }

  @Patch(':id/pay')
  pay(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payOrderDto: PayOrderDto,
  ): Promise<{ data: Order }> {
    return this.orderService.pay(id, payOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.remove(id);
  }
}
