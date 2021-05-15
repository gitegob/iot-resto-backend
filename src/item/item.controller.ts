import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../_shared_/interfaces/enums.interface';
import { Roles } from '../_shared_/decorators/role.decorator';
import { RestoGuard } from 'src/auth/guards/resto.guard';
import { RestoDec } from 'src/_shared_/decorators/resto.decorator';
import { RestoPayload } from 'src/_shared_/interfaces';

@Controller('items')
@ApiSecurity('api_key', ['api_key'])
@ApiBearerAuth()
@ApiTags('Items')
@UseGuards(RestoGuard, JwtGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @ApiCreatedResponse({ description: 'Item created' })
  create(
    @RestoDec() resto: RestoPayload,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.itemService.create(resto, createItemDto);
  }

  @Get()
  @ApiOkResponse()
  findAll(@RestoDec() resto: RestoPayload) {
    return this.itemService.findAll(resto);
  }
  @Get('search')
  search(@RestoDec() resto: RestoPayload, @Query('s') s: string) {
    return this.itemService.search(resto, s);
  }

  @Get(':id')
  @ApiOkResponse()
  findOne(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.itemService.findOneItem(resto, id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @ApiOkResponse()
  update(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(resto, id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @ApiOkResponse()
  remove(
    @RestoDec() resto: RestoPayload,
    @Param('id', ParseIntPipe) id: string,
  ) {
    return this.itemService.remove(resto, id);
  }
}
