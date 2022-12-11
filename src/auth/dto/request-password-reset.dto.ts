import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({
    description: "User's email address",
  })
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  emailAddress: string;
}
