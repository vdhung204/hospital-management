import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, LogOut, Stethoscope } from 'lucide-react';
import { MENU_ITEMS, type MenuItem } from '@/config/menuConfig'; // Import file cấu hình vừa tạo

const Sidebar = () => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Quản lý danh mục'); // Mặc định mở cái này hoặc null

  // Lấy User từ LocalStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || 'GUEST'; // Ví dụ: 'ADMIN'

  // Hàm kiểm tra quyền
  const hasPermission = (item: MenuItem) => {
    return item.roles.includes(userRole);
  };

  // Hàm toggle menu con
  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  // Hàm render 1 item đơn lẻ
  const renderSingleItem = (item: MenuItem) => {
    const isActive = location.pathname === item.path;
    return (
      <Link 
        key={item.title}
        to={item.path!} 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors mb-1 ${
            isActive 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <item.icon size={20} />
        <span>{item.title}</span>
      </Link>
    );
  };

  // Hàm render item có con (Dropdown)
  const renderDropdownItem = (item: MenuItem) => {
    const isOpen = openSubmenu === item.title;
    // Kiểm tra xem đang active ở con nào không để highlight cha
    const isChildActive = item.children?.some(child => location.pathname === child.path);

    return (
        <div key={item.title} className="mb-1">
            <button 
                onClick={() => toggleSubmenu(item.title)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                    isChildActive ? 'text-blue-700 bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.title}</span>
                </div>
                {isOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
            </button>

            {/* Render con */}
            {isOpen && (
                <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 ml-6">
                    {item.children?.map(child => (
                        <Link 
                            key={child.title}
                            to={child.path!}
                            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                                location.pathname === child.path 
                                ? 'text-blue-600 font-bold bg-blue-50' 
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            {child.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col shadow-sm fixed left-0 top-0 z-50">
      {/* 1. Logo */}
      <div className="h-16 flex items-center justify-center border-b px-6">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Stethoscope size={24} className="text-blue-600"/> 
            <span>Hospital<span className="text-gray-800">MIS</span></span>
        </h1>
      </div>
      
      {/* 2. Menu List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
        {MENU_ITEMS.map((item) => {
            // Chỉ render nếu có quyền
            if (!hasPermission(item)) return null;

            // Nếu có children -> Render Dropdown, ngược lại Render Single
            return item.children 
                ? renderDropdownItem(item) 
                : renderSingleItem(item);
        })}
      </nav>

      {/* 3. User Info & Logout */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-sm border border-blue-200">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.username || 'Guest'}</p>
                <p className="text-xs text-gray-500 font-medium bg-gray-200 px-1.5 py-0.5 rounded w-fit mt-0.5">{userRole}</p>
            </div>
        </div>
        <button 
            onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium"
        >
            <LogOut size={16}/> Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;