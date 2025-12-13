// src/services/authService.ts
import axiosClient from '../api/axiosClient';
import type { ChangePasswordForm, CurrentUserResponse, LoginRequest, LoginResponse, UpdateProfileForm } from '../types/auth';

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  // Gọi vào endpoint Backend: POST /api/auth/login
  const response = await axiosClient.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const authService = {
    // ... login, register ...
    getProfile: async () => {
        const res = await axiosClient.get<CurrentUserResponse>('/auth/me');
        return res.data; 
    },
    updateProfile: async (data: UpdateProfileForm) => {
    const response = await axiosClient.put('/portal/account/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordForm) => {
    const response = await axiosClient.post('/portal/account/change-password', data);
    return response.data;
  }
};