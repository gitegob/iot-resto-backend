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
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserData } from '../_shared_/decorators/user.decorator';
import { JwtPayload, RestoPayload } from '../_shared_/interfaces';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../_shared_/decorators/role.decorator';
import { Role } from '../_shared_/interfaces/enums.interface';
import { RestoDec } from 'src/_shared_/decorators/resto.decorator';
import { RestoGuard } from 'src/auth/guards/resto.guard';

@Controller('orders')
@ApiTags('Orders')
@ApiSecurity('api_key', ['api_key'])
@ApiBearerAuth()
@UseGuards(RestoGuard, JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAll(@RestoDec() resto: RestoPayload) {
    return this.orderService.findAllOrders(resto);
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
    @RestoDec() resto: RestoPayload,
    @UserData() user: JwtPayload,
    @Param('tableId', ParseIntPipe) tableId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(resto, user, tableId, createOrderDto);
  }

  /**
   *
   * @param query tableId
   * @returns Order[]
   */
  @Get('table/:tableId')
  findAll(
    @RestoDec() resto: RestoPayload,
    @Param('tableId', ParseIntPipe) tableId: string,
  ) {
    return this.orderService.findAll(resto, tableId);
  }

  /**
   *
   * @returns Order[]
   */
  @Get('paid-confirmed')
  findPaidConfirmed(@RestoDec() resto: RestoPayload) {
    return this.orderService.findPaidConfirmed(resto);
  }

  @Get(':id')
  findOne(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.orderService.findOne({
      where: { id, resto },
      relations: ['orderItems', 'table'],
    });
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(Role.WAITER)
  confirm(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<{ data: Order }> {
    return this.orderService.confirm(resto, id);
  }

  @Patch(':id/finish')
  @UseGuards(RolesGuard)
  @Roles(Role.KITCHEN)
  finish(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<{ data: Order }> {
    return this.orderService.finish(resto, id);
  }

  @Patch('pay')
  @UseGuards(RolesGuard)
  @Roles(Role.WAITER)
  pay(
    @RestoDec() resto: RestoPayload,
    @UserData() user: JwtPayload,
    @Query('uid') uid: string,
  ): Promise<any> {
    return this.orderService.pay(resto, user, uid);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.WAITER)
  remove(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.orderService.delete(resto, id);
  }
}
