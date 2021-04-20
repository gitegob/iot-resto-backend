import {
  IsNumber,
  Max,
  IsString,
  MaxLength,
  Allow,
  IsEnum,
} from 'class-validator';
import { ItemStatus } from '../../_shared_/interfaces/enum.interface';

export class CreateItemDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Max(999999999999)
  price: number;

  @Allow()
  @IsEnum(ItemStatus)
  status: ItemStatus;
}
