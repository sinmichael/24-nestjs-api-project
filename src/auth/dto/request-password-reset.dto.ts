import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({
    description: "User's email address",
  })
  @IsString()
  @IsEmail()
  emailAddress: string;
}
