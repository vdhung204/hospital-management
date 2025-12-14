import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Pill, 
  Settings, 
  FileText,
  Activity,
  type LucideIcon,
  Database
} from 'lucide-react'; 
export interface MenuItem {
  title: string;
  path?: string;
  icon: LucideIcon;
  roles: string[];
  children?: MenuItem[];
  group?: string; // Thêm thuộc tính gom nhóm menu
}

export const MENU_ITEMS: MenuItem[] = [
  {
    group: 'Chức năng chính',
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PHARMACIST', 'TECHNICIAN'],
  },
  {
    group: 'Chức năng chính',
    title: 'Tiếp đón & Bệnh nhân',
    path: '/reception',
    icon: Users,
    roles: ['RECEPTIONIST', 'ADMIN'],
    children: [
      { title: 'Danh sách tiếp đón', path: '/reception/patients', icon: Users, roles: ['RECEPTIONIST', 'ADMIN'] },
      { title: 'Quản lý lịch hẹn', path: '/reception/appointments', icon: FileText, roles: ['RECEPTIONIST', 'ADMIN'] },
      { title: 'Thanh toán & Viện phí', path: '/reception/billing', icon: FileText, roles: ['RECEPTIONIST', 'ADMIN'] },
    ]
  },
  {
    group: 'Chức năng chính',
    title: 'Khám bệnh',
    path: '/doctor/queue',
    icon: Stethoscope,
    roles: ['DOCTOR', 'ADMIN'],
  },
  {
    group: 'Chức năng chính',
    title: 'Dược & Kho',
    path: '/pharmacy',
    icon: Pill,
    roles: ['PHARMACIST', 'ADMIN'],
    children: [
      { title: 'Cấp phát thuốc', path: '/pharmacy', icon: Pill, roles: ['PHARMACIST', 'ADMIN'] },
      { title: 'Quản lý kho thuốc', path: '/inventorys', icon: Database, roles: ['PHARMACIST', 'ADMIN'] },
    ]
  },
  {
    group: 'Chức năng chính',
    title: 'Cận lâm sàng',
    path: '/technician/worklist',
    icon: Activity,
    roles: ['DOCTOR', 'TECHNICIAN', 'ADMIN'],
  },
  {
    group: 'Quản trị & Cấu hình',
    title: 'Danh mục hệ thống',
    icon: Database,
    path: '/admin/categories',
    roles: ['ADMIN'],
    children: [
      { title: 'Dịch vụ & Bảng giá', path: '/admin/services', icon: FileText, roles: ['ADMIN'] },
      { title: 'Nhân sự', path: '/admin/staffs', icon: Users, roles: ['ADMIN'] },
      { title: 'Khoa / Phòng', path: '/admin/departments', icon: Activity, roles: ['ADMIN'] }
    ]
  },
  {
    group: 'Quản trị & Cấu hình',
    title: 'Hệ thống',
    icon: Settings,
    path: '/admin/system',
    roles: ['ADMIN'],
    children: [
      { title: 'Nhật ký hoạt động', path: '/admin/auditlogs', icon: FileText, roles: ['ADMIN'] },
      { title: 'Lịch sử khám bệnh', path: '/admin/history/encounters', icon: FileText, roles: ['ADMIN'] }
    ]
  },
];