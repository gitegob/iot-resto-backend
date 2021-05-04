import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  Max,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ItemStatus } from '../../_shared_/interfaces/enum.interface';

export class CreateItemDto {
  @IsString()
  @MaxLength(200)
  @ApiProperty({
    default: 'King Burger',
  })
  name: string;

  @IsString()
  @ApiProperty({
    default: 'A very tasty burger with double the price',
  })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Max(999999999999)
  @ApiProperty({
    default: 4000,
  })
  price: number;

  @IsOptional()
  @ApiProperty({
    default: ItemStatus.AVAILABLE,
  })
  status: ItemStatus;
}
