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
    default: 'Pizza',
  })
  name: string;

  @IsString()
  @ApiProperty({
    default: "Luigi's extra tasty pizza",
  })
  description: string;

  @IsString()
  @ApiProperty({
    default:
      'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/216054.jpg',
  })
  picture: string;

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
