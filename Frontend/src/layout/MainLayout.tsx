import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from '../config/menuConfig';
import { LogOut, Search, Bell, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import type { UserInfo } from '../types/auth';
import Logo from '@/assets/images/Logo.png';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Quản lý danh mục');
  const [user] = useState<UserInfo | null>(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  const toggleSubmenu = (path: string) => {
    setOpenSubmenu(prev => prev === path ? null : path);
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
  };

  if (!user) return null;

  const currentRoles = user.roles || [];
  const userRoles = currentRoles.map((r: string) => r.replace('ROLE_', ''));
  
  // Logic lọc menu đơn giản hóa để tránh lỗi undefined
  const filteredMenu = MENU_ITEMS.filter(item => 
    !item.roles || item.roles.length === 0 || item.roles.some(role => userRoles.includes(role) || userRoles.includes('ADMIN'))
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white shadow-xl flex-col hidden md:flex z-20">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 p-1">
             <img src={Logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">MediSync</h1>
            <p className="text-xs text-slate-400 font-medium">Hospital MIS</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            // TRƯỜNG HỢP 1: MENU CÓ CON (DROPDOWN)
            if (item.children && item.children.length > 0) {
                const isOpen = openSubmenu === item.path;
                // Kiểm tra xem trang hiện tại có thuộc menu con này không để highlight cha
                const isChildActive = item.children.some(child => location.pathname.startsWith(child.path!));

                return (
                    <div key={item.path} className="mb-1">
                        <button
                            onClick={() => toggleSubmenu(item.path!)}
                            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                                isChildActive ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} className={`transition-colors ${isChildActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="text-sm">{item.title}</span>
                            </div>
                            {isOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                        </button>

                        {/* Render Menu Con */}
                        {isOpen && (
                            <div className="mt-1 ml-4 border-l-2 border-slate-100 pl-2 space-y-1">
                                {item.children.map(child => {
                                    const isSubActive = location.pathname.startsWith(child.path!);
                                    return (
                                        <Link
                                            key={child.path}
                                            to={child.path!}
                                            className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                                                isSubActive 
                                                ? 'text-teal-600 font-bold bg-white shadow-sm' 
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                            }`}
                                        >
                                            {child.title}
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                );
            }

            // TRƯỜNG HỢP 2: MENU ĐƠN (NHƯ CŨ)
            const isActive = location.pathname.startsWith(item.path!);
            return (
              <Link
                key={item.path}
                to={item.path!}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 font-semibold shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className={`transition-colors ${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="text-sm">{item.title}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 w-full rounded-lg transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 md:px-8 z-10 border-b border-slate-200">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
             <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
             </button>
             <h2 className="text-lg font-bold text-slate-800">MediSync</h2>
          </div>

          {/* Desktop Title */}
          <div className="hidden md:block">
             <h2 className="text-lg font-bold text-slate-700">Hệ thống quản lý bệnh viện</h2>
             <p className="text-xs text-slate-400">Welcome back, {user.fullName}</p>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-slate-100 border-none text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all outline-none"
              />
            </div>

            <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-700">{user.fullName}</p>
                <p className="text-[10px] uppercase font-bold text-teal-600 tracking-wider bg-teal-50 px-2 py-0.5 rounded-full inline-block">
                  {user.roles ? user.roles[0]?.replace('ROLE_', '') : 'USER'}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 cursor-pointer hover:shadow-md transition-shadow">
                 <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-teal-600 font-bold text-sm">
                    {user.fullName.charAt(0)}
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;