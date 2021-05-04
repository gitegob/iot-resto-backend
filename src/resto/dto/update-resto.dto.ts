import { PartialType } from '@nestjs/swagger';
import { CreateRestoDto } from './create-resto.dto';

export class UpdateRestoDto extends PartialType(CreateRestoDto) {}
