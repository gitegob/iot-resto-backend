import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestoDto } from './dto/create-resto.dto';
import { Resto } from './entities/resto.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RestoService {
  constructor(
    @InjectRepository(Resto) private restoRepo: Repository<Resto>,
    private readonly jwtService: JwtService,
  ) {}
  async createResto(createRestoDto: CreateRestoDto) {
    const resto = await this.restoRepo.findOne({
      where: { name: createRestoDto.name },
    });
    if (resto) throw new ConflictException('This resto already exists');
    const newResto = new Resto();
    newResto.name = createRestoDto.name;
    newResto.password = await bcrypt.hash(createRestoDto.password, 10);
    newResto.active = createRestoDto.active || true;
    await this.restoRepo.save(newResto);
    delete newResto.password;
    return {
      message: 'Resto created',
      data: {
        resto_token: this.jwtService.sign(newResto),
        restoData: newResto,
      },
    };
  }

  async loginResto(loginRestoDto) {
    const resto = await this.restoRepo.findOne({
      where: { name: loginRestoDto.name, active: true },
    });
    if (!resto) return new UnauthorizedException('Invalid resto credentials');
    const isMatch = await bcrypt.compare(
      loginRestoDto.password,
      resto.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid resto credentials');
    delete resto.password;
    return {
      message: 'Resto logged in',
      data: {
        resto_token: this.jwtService.sign(resto),
        restoData: resto,
      },
    };
  }
}
