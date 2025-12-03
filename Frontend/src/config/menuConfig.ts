import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Pill, 
  Settings, 
  FileText,
  Activity,
  type LucideIcon
} from 'lucide-react'; // Import icon tuỳ thích

export interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  roles: string[]; // Những quyền nào được thấy menu này
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PHARMACIST', 'TECHNICIAN'], // Ai cũng thấy
  },
  {
    title: 'Tiếp đón & Bệnh nhân',
    path: '/reception/patients',
    icon: Users,
    roles: ['RECEPTIONIST', 'ADMIN'], // Chỉ lễ tân và admin
  },
  {
    title: 'Thanh toán & Viện phí',
    path: '/reception/billing',
    icon: FileText,
    roles: ['RECEPTIONIST', 'ADMIN'],
  },
  {
    title: 'Khám bệnh (Bác sĩ)',
    path: '/doctor/queue',
    icon: Stethoscope,
    roles: ['DOCTOR', 'ADMIN'],
  },
  {
    title: 'Kho Dược & Cấp phát',
    path: '/pharmacy',
    icon: Pill,
    roles: ['PHARMACIST', 'ADMIN'],
  },
  {
    title: 'Cận lâm sàng (Lab/X-Ray)',
    path: '/technician/worklist',
    icon: Activity,
    roles: ['DOCTOR','TECHNICIAN', 'ADMIN'],
  },
  {
    title: 'Quản trị hệ thống',
    path: '/admin/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
];