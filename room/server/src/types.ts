export interface User {
  username: string;
  elo: number;
  admin: boolean;
  settings: any;
  avatar?: number;
  deck?: string;
  chat?: boolean;
}
