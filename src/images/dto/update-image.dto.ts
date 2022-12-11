import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';
import { CreateImageDto } from './create-image.dto';

export class UpdateImageDto extends PartialType(CreateImageDto) {
  @ApiProperty({ description: 'Number of hits' })
  @IsNumber()
  hits: number;

  @ApiProperty({ description: 'URI of the image' })
  @IsString()
  @IsUrl()
  uri: string;
}
