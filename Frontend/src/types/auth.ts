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
export interface PatientInfo {
  id: number;
  patientCode: string;
  fullName: string;
  dateOfBirth: string; 
  gender: string;
  phone: string;
  idNumber: string;
  address: string;
}

export interface StaffInfo {
  id: number;
  staffCode: string;
  fullName: string;
  staffType: string; 
  position: string;  
  
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  
  phone: string;
  email: string;
}
export interface CurrentUserResponse {
  userId: number;
  username: string;
  fullName: string;
  accountType: 'PATIENT' | 'STAFF' | 'OTHER' | string; 
  roles: string[];
  patient?: PatientInfo | null; 
  staff?: StaffInfo | null;
}

export interface UpdateProfileForm {
  fullName: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  idNumber: string;
  email?: string;
}

export interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}