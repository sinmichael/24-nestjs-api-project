import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({
    description: "User's email address",
  })
  @IsEmail()
  emailAddress: string;
}
