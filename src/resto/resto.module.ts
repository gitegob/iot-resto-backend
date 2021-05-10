import { Module } from '@nestjs/common';
import { RestoService } from './resto.service';
import { RestoController } from './resto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resto } from './entities/resto.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from '../_shared_/config/env.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resto]),
    JwtModule.register({
      secret: jwt.secret,
    }),
  ],
  controllers: [RestoController],
  providers: [RestoService],
  exports: [RestoService],
})
export class RestoModule {}
