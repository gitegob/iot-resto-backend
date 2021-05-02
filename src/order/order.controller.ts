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
import { JwtGuard } from '../_shared_/guards/jwt.guard';
import { RolesGuard } from '../_shared_/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../_shared_/interfaces/enum.interface';
import { UserData } from '../_shared_/decorators/user.decorator';
import { JwtPayload } from '../_shared_/interfaces';

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
    @UserData() user: JwtPayload,
  ) {
    return this.orderService.create(tableId, user);
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
