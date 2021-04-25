import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max } from 'class-validator';

export class CreateTableDto {
  @IsNumber()
  @Max(1000)
  @ApiProperty({ default: 5 })
  number: number;
}
