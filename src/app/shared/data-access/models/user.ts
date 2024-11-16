export interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string;
}

export interface UserFormData {
  image: string;
  username: string;
  bio: string | null;
  email: string;
  password: string;
}
