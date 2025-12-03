import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '@/services/authService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import logo from '@/assets/images/Logo.png';

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
        staffId: data.staffId,
        roles: data.roles
      }));

      toast.success(`Xin chào, ${data.fullName}!`);
      navigate('/dashboard'); 

    } catch (error) {
    console.error(error);

    if (error instanceof AxiosError) {
        if (error.response) {
            const message = error.response.data?.message || 'Lỗi xác thực!';
            toast.error(message);
        } 
        else if (error.request) {
            toast.error('Không thể kết nối đến Server. Vui lòng kiểm tra đường truyền!');
        } 
        else {
            toast.error('Lỗi gửi yêu cầu đăng nhập!');
        }
    } else {
        toast.error('Đã xảy ra lỗi không xác định.');
    }
    } finally {
      setLoading(false);
    }
  };

 return (
    // 1. Nền Gradient
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      
      {/* 2. Form container */}
      <div className="w-full max-w-md animate-slide-up rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-100">
        
        {/* --- LOGO AREA --- */}
        <div className="mb-8 text-center">
          {/* Container cho ảnh để căn giữa tuyệt đối */}
          <div className="flex justify-center mb-4">
             <img 
                src={logo} 
                alt="Hospital Logo" 
                // Class Tailwind: Kích thước to (h-28), giữ tỷ lệ (object-contain), bóng đổ (drop-shadow)
                className="h-20 w-20 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
             />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Hospital MIS</h2>
          <p className="mt-2 text-sm text-gray-500">Đăng nhập để truy cập hệ thống</p>
        </div>
        
        {/* --- FORM AREA --- */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-95 ${
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