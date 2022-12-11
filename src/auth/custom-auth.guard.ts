import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    user = this.transformUser(user);
    return user;
  }

  transformUser(user) {
    const _roles = [];
    _roles.push(user.role);

    return {
      id: user.id,
      emailAddress: user.emailAddress,
      roles: _roles,
    };
  }
}
