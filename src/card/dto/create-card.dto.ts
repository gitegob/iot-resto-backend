import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @ApiProperty({ default: 'Rudoviko Gaspard' })
  owner: string;
  @IsString()
  @ApiProperty({ default: '138473C834H' })
  uid: string;
}
