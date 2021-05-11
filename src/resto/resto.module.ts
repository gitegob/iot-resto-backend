import { Global, Module } from '@nestjs/common';
import { RestoService } from './resto.service';
import { RestoController } from './resto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resto } from './entities/resto.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Resto])],
  controllers: [RestoController],
  providers: [RestoService],
  exports: [RestoService],
})
export class RestoModule {}
