import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CardDto {
  @IsString()
  @ApiProperty({
    default: 'the card id here',
  })
  id: string;
}
