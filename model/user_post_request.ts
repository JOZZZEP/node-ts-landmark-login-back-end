export interface UserPostRequest {
  uid: number;
  username: string;
  password?: string;
  country: string;
  avatar: string;
  role?: string;
  userKey: string;
}
