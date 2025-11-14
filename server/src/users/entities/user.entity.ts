export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserEntity {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: number;
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

