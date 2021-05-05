import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestoDto } from './dto/create-resto.dto';
import { Resto } from './entities/resto.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RestoService {
  constructor(@InjectRepository(Resto) private restoRepo: Repository<Resto>) {}
  async createResto(createRestoDto: CreateRestoDto) {
    const resto = await this.restoRepo.findOne({
      where: { restoname: createRestoDto.restoname },
    });
    if (resto) throw new ConflictException('Resto already exists');
    const newResto = new Resto();
    newResto.restoname = createRestoDto.restoname;
    newResto.restopassword = await bcrypt.hash(createRestoDto.password, 10);
    await this.restoRepo.save(newResto);
    return { message: 'Resto created' };
  }
}
