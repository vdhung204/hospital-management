import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Clock, User, LogOut, Menu, X } from 'lucide-react';

const PatientLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Check role, nếu không phải PATIENT thì đá ra
    if (!user || !user.roles?.includes('ROLE_PATIENT')) {
       // navigate('/login'); // Bật lại khi đã có Auth
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const menuItems = [
    { icon: Home, label: 'Trang chủ', path: '/portal/dashboard' },
    { icon: Calendar, label: 'Đặt lịch', path: '/portal/booking' },
    { icon: Clock, label: 'Lịch sử khám', path: '/portal/history' },
    { icon: Calendar, label: 'Lịch hẹn của tôi', path: '/portal/appointments' },
    // { icon: FileText, label: 'Kết quả XN', path: '/portal/results' },
    { icon: User, label: 'Hồ sơ cá nhân', path: '/portal/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Mobile Header */}
      <div className="bg-teal-600 text-white p-4 flex justify-between items-center shadow-md md:hidden sticky top-0 z-20">
        <h1 className="font-bold text-lg">Cổng Bệnh Nhân</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar (Desktop) & Mobile Menu */}
        <aside className={`
            fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg">
                {user.fullName ? user.fullName.charAt(0) : 'P'}
             </div>
             <div>
                <p className="font-bold text-sm truncate w-32">{user.fullName || 'Bệnh nhân'}</p>
                <p className="text-xs text-slate-400">Mã: {user.username}</p>
             </div>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
            
            <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-8">
               <LogOut size={20} /> Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 h-[calc(100vh-60px)] md:h-screen overflow-y-auto">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;