// src/types/auth.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserInfo {
  userId: number;
  username: string;
  fullName: string;
  roles: string[];
  patientId?: number | null;
  staffId?: number | null;
}

export interface LoginResponse extends UserInfo {
  accessToken: string;
  tokenType: string;
}