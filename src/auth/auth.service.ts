import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/users/user.roles.enum';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import * as sgMail from '@sendgrid/mail';
import { PasswordResetDto } from './dto/password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  /**
   * Registers a new user
   *
   * @param authCredentialsDto
   *
   */
  async register(authCredentialsDto: AuthCredentialsDto) {
    const { emailAddress, password } = authCredentialsDto;

    const userCount = await this.userRepository.count();

    const user = new User();
    user.emailAddress = emailAddress;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.role = userCount === 0 ? UserRoles.ADMIN : UserRoles.USER;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email address already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Login
   *
   * @param authCredentialsDto
   * @returns Promise<{ accressToken: string }>
   *
   */
  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const emailAddress = await this.validatePassword(authCredentialsDto);

    if (!emailAddress) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { emailAddress };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * Validates the email address and password combination, if valid,
   * it will return the email address of the user
   *
   * @param authCredentialsDto
   * @returns Promise<string>
   *
   */
  private async validatePassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { emailAddress, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({
      where: { emailAddress: emailAddress },
    });

    if (user && (await user.validatePassword(password))) {
      return user.emailAddress;
    } else {
      return null;
    }
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto) {
    const { emailAddress } = requestPasswordResetDto;
    const user = await this.userRepository.findOne({
      where: { emailAddress: emailAddress },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const passwordResetToken = Math.random().toString(36).substring(2, 12);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    user.passwordResetToken = passwordResetToken;
    await user.save();
    const message = {
      to: emailAddress,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: '[24 Hour Code Challenge] Password change request',
      text: `Hi! Your password reset token is ${passwordResetToken}`,
    };

    try {
      await sgMail.send(message);
    } catch (error) {
      this.logger.error(`SendGrid: ${error.response.body.errors[0].message}`);
      throw new InternalServerErrorException();
    }
  }

  async passwordReset(passwordResetDto: PasswordResetDto) {
    const { emailAddress, passwordResetToken, password } = passwordResetDto;
    const user = await this.userRepository.findOne({
      where: { emailAddress: emailAddress },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (user.passwordResetToken !== passwordResetToken)
      throw new HttpException(
        'Invalid password reset token',
        HttpStatus.BAD_REQUEST,
      );

    if (user && user.passwordResetToken === passwordResetToken) {
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);
      user.passwordResetToken = null;
      await user.save();
    }
  }

  /**
   * Hashes the password with the salt provided using bcrypt
   *
   * @param password
   * @param salt
   * @returns Promise<string>
   *
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
