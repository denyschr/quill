export interface UserModel {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string;
}

export interface UserFormDataModel {
  image: string;
  username: string;
  bio: string | null;
  email: string;
  password: string;
}
