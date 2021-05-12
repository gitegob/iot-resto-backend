import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Role } from '../_shared_/interfaces/enums.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../_shared_/decorators/role.decorator';
import { RestoDec } from 'src/_shared_/decorators/resto.decorator';
import { RestoPayload } from 'src/_shared_/interfaces';
import { RestoGuard } from 'src/auth/guards/resto.guard';

@ApiTags('Order Items')
@ApiSecurity('api_key', ['api_key'])
@ApiBearerAuth()
@UseGuards(RestoGuard, JwtGuard)
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post('order/:orderId')
  @Roles(Role.WAITER)
  @UseGuards(RolesGuard)
  create(
    @RestoDec() resto: RestoPayload,
    @Body() createOrderItemDto: CreateOrderItemDto,
    @Param('orderId', ParseIntPipe) orderId: string,
    @Query('itemId', ParseIntPipe) itemId: string,
  ) {
    return this.orderItemService.create(
      resto,
      createOrderItemDto,
      orderId,
      itemId,
    );
  }

  @Get('order/:orderId')
  findAll(
    @RestoDec() resto: RestoPayload,
    @Param('orderId', ParseIntPipe) orderId: string,
  ) {
    return this.orderItemService.findByOrder(resto, orderId);
  }

  @Get(':id')
  findOne(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.orderItemService.findOne({
      where: { id, resto },
      relations: ['order'],
    });
  }

  @Delete(':id')
  @Roles(Role.WAITER)
  @UseGuards(RolesGuard)
  remove(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.orderItemService.remove(resto, id);
  }
}
