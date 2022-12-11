import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ description: 'URI of the image' })
  @IsString()
  @IsUrl()
  uri: string;

  @ApiProperty({
    description:
      'Can only be used by a user with an ADMIN role. Sets the owner of the image by the user ID. If no ID is provided, the owner will be set to the user making the request.',
  })
  @IsNumber()
  owner: number;
}
