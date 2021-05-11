import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/_shared_/decorators/role.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/_shared_/interfaces/enum.interface';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { RestoGuard } from 'src/auth/guards/resto.guard';

@UseGuards(RestoGuard, JwtGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Cards')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @Roles(Role.MANAGER)
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }
  @Get('transactions')
  findAllTransactions() {
    return this.cardService.findAllTransactions();
  }
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.cardService.findOneCard(uid);
  }

  @Get(':uid/transactions')
  findSingleCardTransactions(@Param('uid') uid: string) {
    return this.cardService.findSingleCardTransactions(uid);
  }

  @Get(':uid/deduct')
  @Roles(Role.WAITER)
  deductBalance(
    @Param('uid') uid: string,
    @Query('orderId', ParseIntPipe) orderId: string,
    @Query('amount', ParseIntPipe) amount: string,
  ) {
    return this.cardService.deductBalance(uid, orderId, +amount);
  }

  @Patch(':uid/recharge')
  @Roles(Role.MANAGER, Role.WAITER)
  rechargeBalance(
    @Param('uid') uid: string,
    @Query('amount', ParseIntPipe) amount: string,
  ) {
    return this.cardService.rechargeBalance(uid, +amount);
  }

  @Delete(':uid')
  @Roles(Role.MANAGER)
  remove(@Param('uid') uid: string) {
    return this.cardService.remove(uid);
  }
}
