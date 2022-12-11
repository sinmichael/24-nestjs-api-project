import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @Post('/register')
  register(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.register(authCredentialsDto);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('/login')
  login(
    @Body(ValidationPipe) authCredenialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredenialsDto);
  }

  @ApiOperation({ summary: 'Request for a password reset' })
  @Post('/request-password-reset')
  requestPasswordReset(
    @Body(ValidationPipe) requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(requestPasswordResetDto);
  }

  @ApiOperation({ summary: 'Password reset' })
  @Post('/password-reset')
  passwordReset(@Body(ValidationPipe) passwordResetDto: PasswordResetDto) {
    return this.authService.passwordReset(passwordResetDto);
  }
}
