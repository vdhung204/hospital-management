import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from '../config/menuConfig';
import { LogOut, User as UserIcon } from 'lucide-react';
import type { UserInfo } from '../types/auth'; // Nhớ import type này
 // Nhớ import type này

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- SỬA LỖI Ở ĐÂY ---
  // 1. Lấy dữ liệu ngay khi khởi tạo state (Lazy init)
  // Cách này chỉ chạy 1 lần khi component mount, không gây re-render
  const [user] = useState<UserInfo | null>(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  // 2. useEffect chỉ còn nhiệm vụ đá về trang login nếu không có user
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    // Chuyển hướng ngay lập tức
    window.location.href = '/login'; 
  };

  // Nếu chưa có user (đang check hoặc redirect), không render gì cả để tránh lỗi UI
  if (!user) return null;

  // --- Logic lọc menu giữ nguyên ---
  // Xử lý mảng roles (đề phòng backend trả về null hoặc rỗng)
  const currentRoles = user.roles || [];
  const userRoles = currentRoles.map((r: string) => r.replace('ROLE_', ''));
  
  const filteredMenu = MENU_ITEMS.filter(item => 
    item.roles.some(role => userRoles.includes(role))
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR - Giữ nguyên code cũ */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            H
          </div>
          <span className="text-xl font-bold text-gray-800">Hospital MIS</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT - Giữ nguyên code cũ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-700">
            Hệ thống quản lý bệnh viện
          </h2>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              {/* Sửa hiển thị roles một chút để tránh lỗi nếu mảng rỗng */}
              <p className="text-xs text-gray-500">
                {user.roles ? user.roles.join(', ') : ''}
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
               <UserIcon size={24} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;