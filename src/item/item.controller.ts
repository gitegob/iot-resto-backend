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
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../_shared_/guards/jwt.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../_shared_/guards/roles.guard';
import { Role } from '../_shared_/interfaces/enum.interface';

@Controller('items')
@ApiBearerAuth()
@ApiTags('Items')
@UseGuards(JwtGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @ApiCreatedResponse({ description: 'Item created' })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  @ApiOkResponse()
  findAll() {
    return this.itemService.findAll();
  }
  @Get('search')
  search(@Query('s') s: string) {
    return this.itemService.search(s);
  }

  @Get(':id')
  @ApiOkResponse()
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.itemService.findOneItem(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @ApiOkResponse()
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.MANAGER)
  @ApiOkResponse()
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.itemService.remove(id);
  }
}
