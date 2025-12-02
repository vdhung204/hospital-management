// src/services/authService.ts
import axiosClient from '../api/axiosClient';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  // Gọi vào endpoint Backend: POST /api/auth/login
  const response = await axiosClient.post<LoginResponse>('/auth/login', data);
  return response.data;
};