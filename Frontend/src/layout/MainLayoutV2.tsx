import { useState, useEffect } from 'react';
import { 
  Outlet, 
  Link, 
  useLocation, 
  useNavigate
} from 'react-router-dom';
import {
  Activity,
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  ChevronRight,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import { MENU_ITEMS, type MenuItem } from '@/config/menuConfig';
import type { UserInfo } from '@/types/auth';




// --- COMPONENTS ---

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="h-9 w-9 bg-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-600/20">
      <Activity className="text-white" size={20} />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-bold text-slate-800 tracking-tight leading-none">MediSync</span>
      <span className="text-[10px] uppercase font-semibold text-teal-600 tracking-wider">Hospital MIS</span>
    </div>
  </div>
);

const UserDropdown = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  return (
    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
      <div className="text-right hidden md:block">
        <p className="text-sm font-semibold text-slate-700 leading-tight">{user.fullName}</p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <ShieldCheck size={10} className="text-teal-500" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            {user.roles[0]?.replace('ROLE_', '')}
          </p>
        </div>
      </div>
      <button className="h-10 w-10 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-600 transition-colors flex items-center justify-center border border-slate-200">
         <UserCircle size={24} className="text-slate-400" />
      </button>
    </div>
  );
};

const SidebarItem = ({ 
  item, 
  isOpen, 
  isActive, 
  isChildActive, 
  onToggle 
}: { 
  item: MenuItem, 
  isOpen: boolean, 
  isActive: boolean, 
  isChildActive: boolean, 
  onToggle: () => void 
}) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  // Base classes
  const baseButtonClass = `w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 group relative`;
  
  // Active styling logic
  let activeClass = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  if (isActive) {
    activeClass = "bg-teal-600 text-white shadow-md shadow-teal-600/20";
  } else if (isChildActive) {
    activeClass = "bg-teal-50 text-teal-700 font-medium";
  }

  return (
    <div>
      {hasChildren ? (
        <button onClick={onToggle} className={`${baseButtonClass} ${activeClass}`}>
          <div className="flex items-center gap-3">
            <Icon size={20} className={isActive ? 'text-white' : (isChildActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600')} />
            <span className="text-sm">{item.title}</span>
          </div>
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${isActive ? 'text-white/80' : 'text-slate-400'}`} 
          />
        </button>
      ) : (
        <Link to={item.path!} className={`${baseButtonClass} ${activeClass}`}>
          <div className="flex items-center gap-3">
            <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
            <span className="text-sm">{item.title}</span>
          </div>
          {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
        </Link>
      )}

      {/* Submenu with animation effect */}
      {hasChildren && isOpen && (
        <div className="ml-4 pl-3 border-l-2 border-slate-100 space-y-1 my-1 animate-in slide-in-from-top-2 duration-200">
          {item.children!.map((child) => (
            <SidebarSubItem key={child.path} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarSubItem = ({ item }: { item: MenuItem }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path; // Exact match for children

  return (
    <Link
      to={item.path!}
      className={`block px-3 py-2 rounded-md text-sm transition-all ${
        isActive 
          ? 'text-teal-700 font-medium bg-teal-50/50 translate-x-1' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-2">
         {/* Small dot for subitems */}
        <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
        {item.title}
      </div>
    </Link>
  );
};

// --- MAIN LAYOUT ---
const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('Quản lý danh mục');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [user] = useState<UserInfo | null>(() => {
     const userStr = localStorage.getItem('user');
     return userStr ? JSON.parse(userStr) : null;
   });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(prev => prev === title ? null : title);
  };

  const handleLogout = () => {
    // Logic logout thực tế
    console.log("Logged out");
    navigate('/login');
  };

  if (!user) return null;

  // Filter menu logic
  const currentRoles = user.roles.map((r: string) => r.replace('ROLE_', ''));
  const filterItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      const hasRole = !item.roles || item.roles.length === 0 || item.roles.some(r => currentRoles.includes(r) || currentRoles.includes('ADMIN'));
      if (!hasRole) return false;
      return true;
    });
  };
  
  const filteredMenu = filterItems(MENU_ITEMS);

  // Group menu items logic
  const groupedMenu: { [key: string]: MenuItem[] } = {};
  filteredMenu.forEach(item => {
    const groupName = item.group || 'Khác';
    if (!groupedMenu[groupName]) groupedMenu[groupName] = [];
    groupedMenu[groupName].push(item);
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* --- SIDEBAR (DESKTOP) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Logo />
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {Object.entries(groupedMenu).map(([groupName, items]) => (
            <div key={groupName} className="mb-6 last:mb-0">
              <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{groupName}</h3>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const isChildActive = item.children?.some(child => location.pathname.startsWith(child.path!)) || false;
                  
                  return (
                    <SidebarItem 
                      key={item.title}
                      item={item}
                      isActive={isActive}
                      isChildActive={isChildActive}
                      isOpen={openSubmenu === item.title}
                      onToggle={() => toggleSubmenu(item.title)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut size={20} className="group-hover:stroke-2" />
            <span className="text-sm font-medium">Đăng xuất hệ thống</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            {/* Breadcrumb / Title Context */}
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-slate-800">
                {filteredMenu.find(m => location.pathname.startsWith(m.path || ''))?.title || 'Tổng quan'}
              </h1>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                 MediSync <ChevronRight size={10} /> {location.pathname.split('/').filter(Boolean).join(' / ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Bar */}
            <div className="relative hidden lg:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm hồ sơ bệnh nhân (F3)..." 
                className="pl-10 pr-4 py-2 w-64 lg:w-80 rounded-full bg-slate-100 border-transparent text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none placeholder:text-slate-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:block">
                 <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">ESC</span>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Profile */}
            <UserDropdown user={user} onLogout={handleLogout} />
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-auto bg-slate-50/50 p-4 md:p-6 lg:p-8 relative">
           {/* Decorative Background Pattern (Optional) */}
           <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-teal-50/50 to-transparent pointer-events-none -z-10" />
           
           <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
             <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
};
export default MainLayout;