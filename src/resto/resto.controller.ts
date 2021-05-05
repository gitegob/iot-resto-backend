import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RestoService } from './resto.service';
import { CreateRestoDto } from './dto/create-resto.dto';
import { JwtGuard } from '../_shared_/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../_shared_/interfaces/enum.interface';
import { RolesGuard } from '../_shared_/guards/roles.guard';

@Controller('restos')
@ApiTags('Restos')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class RestoController {
  constructor(private readonly restoService: RestoService) {}

  @Post('new')
  @Roles(Role.SITE_ADMIN)
  @UseGuards(RolesGuard)
  createResto(@Body() createRestoDto: CreateRestoDto) {
    return this.restoService.createResto(createRestoDto);
  }
}
