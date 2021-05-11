import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { PayOrderDto } from './dto/pay-order.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserData } from '../_shared_/decorators/user.decorator';
import { JwtPayload } from '../_shared_/interfaces';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../_shared_/decorators/role.decorator';
import { Role } from '../_shared_/interfaces/enum.interface';

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAll() {
    return this.orderService.findAllOrders();
  }
  /**
   *
   * @param query tableId
   * @returns Order
   */
  @Post('table/:tableId')
  @UseGuards(RolesGuard)
  @Roles(Role.WAITER)
  create(
    @Param('tableId', ParseIntPipe) tableId: string,
    @Body() createOrderDto: CreateOrderDto,
    @UserData() user: JwtPayload,
  ) {
    return this.orderService.create(tableId, user, createOrderDto);
  }

  /**
   *
   * @param query tableId
   * @returns Order[]
   */
  @Get('table/:tableId')
  findAll(@Param('tableId', ParseIntPipe) tableId: string) {
    return this.orderService.findAll(tableId);
  }

  /**
   *
   * @returns Order[]
   */
  @Get('paid-confirmed')
  findPaidConfirmed() {
    return this.orderService.findPaidConfirmed();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.orderService.findOne({
      where: { id },
      relations: ['orderItems', 'table'],
    });
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(Role.WAITER)
  confirm(@Param('id', ParseIntPipe) id: string): Promise<{ data: Order }> {
    return this.orderService.confirm(id);
  }

  @Patch(':id/finish')
  @UseGuards(RolesGuard)
  @Roles(Role.KITCHEN)
  finish(@Param('id', ParseIntPipe) id: string): Promise<{ data: Order }> {
    return this.orderService.finish(id);
  }

  @Patch(':id/pay')
  pay(
    @Param('id', ParseIntPipe) id: string,
    @Body() payOrderDto: PayOrderDto,
  ): Promise<{ data: Order }> {
    return this.orderService.pay(id, payOrderDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.WAITER)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.orderService.cancel(id);
  }
}
