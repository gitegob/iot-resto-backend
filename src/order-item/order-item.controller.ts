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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Role } from '../_shared_/interfaces/enum.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../_shared_/decorators/role.decorator';

@ApiTags('Order Items')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post('order/:orderId')
  @Roles(Role.WAITER)
  @UseGuards(RolesGuard)
  create(
    @Body() createOrderItemDto: CreateOrderItemDto,
    @Param('orderId', ParseIntPipe) orderId: string,
    @Query('itemId', ParseIntPipe) itemId: string,
  ) {
    return this.orderItemService.create(createOrderItemDto, orderId, itemId);
  }

  @Get('order/:orderId')
  findAll(@Param('orderId', ParseIntPipe) orderId: string) {
    return this.orderItemService.findByOrder(orderId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.orderItemService.findOne({
      where: { id },
      relations: ['order'],
    });
  }

  @Delete(':id')
  @Roles(Role.WAITER)
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.orderItemService.remove(id);
  }
}
