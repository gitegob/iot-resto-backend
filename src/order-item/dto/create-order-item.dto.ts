import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, IsString, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Max(1000)
  @ApiProperty({
    default: 5,
  })
  quantity: number;
}
