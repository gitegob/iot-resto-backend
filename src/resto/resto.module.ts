import { Global, Module } from '@nestjs/common';
import { RestoService } from './resto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resto } from './entities/resto.entity';
import { User } from 'src/auth/entities/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Resto, User])],
  providers: [RestoService],
  exports: [RestoService],
})
export class RestoModule {}
