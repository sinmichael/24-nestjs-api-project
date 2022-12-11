import { RolesBuilder } from 'nest-access-control';
import { UserRoles } from './users/user.roles.enum';

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(UserRoles.USER)
  .createOwn('image')
  .readOwn('image')
  .updateOwn('image')
  .deleteOwn('image')
  .grant(UserRoles.ADMIN)
  .createAny('image')
  .readAny('image')
  .updateAny('image')
  .deleteAny('image');
