import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({
    description: "User's email address",
  })
  @IsEmail()
  emailAddress: string;

  @ApiProperty({
    description: "User's password reset token",
  })
  @IsString()
  passwordResetToken: string;

  @ApiProperty({
    description:
      "User's password. Must be at least 8 characters long, at least one uppercase letter, at least one lowercase letter, at least one number and at least one special character",
  })
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least eight (8) characters long.',
  })
  @MaxLength(32)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, at least one lowercase letter and at least one symbol.',
    },
  )
  password: string;
}
