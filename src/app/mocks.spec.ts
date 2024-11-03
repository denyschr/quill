import { UserModel } from '@shared/data-access/models';

export function getMockedUser(user: Partial<UserModel> = {}): UserModel {
  return {
    email: 'email@gmail.com',
    token: 'token',
    username: 'username',
    bio: 'bio',
    image: 'image',
    ...user
  };
}
