import { LoginCredentials, RegisterCredentials } from '@auth/data-access/models';
import { Article, Profile, User } from '@shared/data-access/api/models';

export const getMockedLoginCredentials = (
  credentials: Partial<LoginCredentials> = {}
): LoginCredentials => {
  return {
    email: 'jack@gmail.com',
    password: 'jack1234',
    ...credentials
  };
};

export const getMockedRegisterCredentials = (
  credentials: Partial<RegisterCredentials> = {}
): RegisterCredentials => {
  return {
    username: 'jack',
    email: 'jack@gmail.com',
    password: 'jack1234',
    ...credentials
  };
};

export const getMockedUser = (user: Partial<User> = {}): User => {
  return {
    email: 'jack@gmail.com',
    bio: 'I work at a state farm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo',
    username: 'jack',
    ...user
  };
};

export const getMockedProfile = (profile: Partial<Profile> = {}): Profile => {
  return {
    username: 'jack',
    bio: 'I work at a state farm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg',
    following: false,
    ...profile
  };
};

export const getMockedArticle = (
  {
    article,
    profile
  }: {
    article?: Partial<Article>;
    profile?: Partial<Profile>;
  } = { article: {}, profile: {} }
): Article => {
  return {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wondered how?',
    body: 'It takes a Jacobian',
    tagList: ['dragons', 'training'],
    createdAt: new Date('02/18/2016').toString(),
    updatedAt: new Date('02/18/2016').toString(),
    favorited: false,
    favoritesCount: 0,
    ...article,
    author: getMockedProfile(profile)
  };
};
