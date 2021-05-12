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
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/_shared_/decorators/role.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/_shared_/interfaces/enums.interface';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UserData } from 'src/_shared_/decorators/user.decorator';
import { JwtPayload, RestoPayload } from 'src/_shared_/interfaces';
import { RestoGuard } from 'src/auth/guards/resto.guard';
import { RestoDec } from 'src/_shared_/decorators/resto.decorator';

@Controller('cards')
@UseGuards(JwtGuard, RolesGuard)
@ApiSecurity('api_key', ['api_key'])
@ApiBearerAuth()
@ApiTags('Cards')
@Roles(Role.AGENT)
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

  @Get('transactions/all')
  findAllTransactions() {
    return this.cardService.findAllTransactions();
  }

  @Get('transactions')
  @UseGuards(RestoGuard)
  @Roles(Role.MANAGER, Role.RESTO_ADMIN)
  findRestoTransactions(@RestoDec() resto: RestoPayload) {
    return this.cardService.findRestoTransactions(resto);
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.cardService.findOneCard(uid);
  }

  @Get(':uid/transactions')
  findSingleCardTransactions(@Param('uid') uid: string) {
    return this.cardService.findSingleCardTransactions(uid);
  }

  @Patch(':uid/recharge')
  rechargeBalance(
    @UserData() user: JwtPayload,
    @Param('uid') uid: string,
    @Query('amount', ParseIntPipe) amount: string,
  ) {
    return this.cardService.rechargeBalance(user, uid, +amount);
  }

  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.cardService.remove(uid);
  }
}
