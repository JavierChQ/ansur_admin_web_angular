export interface AuthRole {
  id?: string;
  name?: string;
  image?: string;
  route?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id?: string;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  image?: string | null;
  notification_token?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  roles?: AuthRole[];
  role?: string;
}

export interface AuthResponse {
  access_token?: string;
  accessToken?: string;
  token?: string;
  jwt?: string;
  user?: AuthUser;
}

export interface LoginAuthDto {
  email: string;
  password: string;
}

export interface RegisterAuthDto {
  name?: string;
  lastname?: string;
  phone?: string;
  email: string;
  password: string;
  rolesIds?: string[];
}
