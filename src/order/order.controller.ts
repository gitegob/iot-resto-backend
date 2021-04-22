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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryParamsDto } from '../_shared_/dto/query-params.dto';
import { ApiTags } from '@nestjs/swagger';

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
  create(@Body() createOrderDto: CreateOrderDto, @Query() q: QueryParamsDto) {
    return this.orderService.create(createOrderDto, q.tableId);
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
    return this.orderService.findOne({ where: { id }, relations: ['items'] });
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.remove(id);
  }
}
