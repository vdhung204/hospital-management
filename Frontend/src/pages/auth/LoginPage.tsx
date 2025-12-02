// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '@/services/authService';
import { toast } from 'react-toastify'; // Import toast nếu cài
import { AxiosError } from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // State lưu input
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Xử lý khi bấm nút Đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Chặn reload trang
    setLoading(true);

    try {
      // 1. Gọi API
      const data = await loginApi({ username, password });

      // 2. Lưu Token và thông tin User vào localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        username: data.username,
        fullName: data.fullName,
        roles: data.roles
      }));

      toast.success(`Xin chào, ${data.fullName}!`);
      navigate('/dashboard'); 

    } catch (error) {
    console.error(error);

    if (error instanceof AxiosError) {
        // 1. Lỗi do Server trả về (VD: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error)
        // Lúc này error.response CÓ dữ liệu
        if (error.response) {
            // Lấy message từ Backend trả về (như bạn đã làm)
            const message = error.response.data?.message || 'Lỗi xác thực!';
            toast.error(message);
        } 
        // 2. Lỗi không nhận được phản hồi (Network Error, Server Down, CORS)
        // Lúc này error.request có, nhưng error.response thì KHÔNG
        else if (error.request) {
            toast.error('Không thể kết nối đến Server. Vui lòng kiểm tra đường truyền!');
        } 
        // 3. Lỗi khi setup request (ít gặp)
        else {
            toast.error('Lỗi gửi yêu cầu đăng nhập!');
        }
    } else {
        // Lỗi logic code JS (VD: biến undefined...)
        toast.error('Đã xảy ra lỗi không xác định.');
    }
    } finally {
      setLoading(false);
    }
  };

 return (
    // 1. Nền Gradient đẹp mắt
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100 via-white to-primary-50 p-4">
      
      {/* 2. Form dùng hiệu ứng animation slide-up và đổ bóng */}
      <div className="w-full max-w-md animate-slide-up rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-100">
        
        <div className="mb-8 text-center">
          {/* Logo giả lập */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m-6-6h12"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Hospital MIS</h2>
          <p className="mt-2 text-sm text-gray-500">Đăng nhập để truy cập hệ thống</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 3. Button dùng màu Primary và hiệu ứng nhấn */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full transform rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary-500/30 active:scale-95 ${
              loading ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;