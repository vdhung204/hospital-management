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
} from 'lucide-react'; // Import icon tuỳ thích

export interface MenuItem {
  title: string;
  path?: string;
  icon: LucideIcon;
  roles: string[]; // Những quyền nào được thấy menu này
  children?: MenuItem[];
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
    children:[
      {
        title: 'Tiếp đón & Bệnh nhân',
    path: '/reception/patients',
    icon: Users,
    roles: ['RECEPTIONIST', 'ADMIN'],
      },
      {
        title: 'Lịch hẹn',
        path: '/reception/appointments',
        icon: Users,
        roles: ['RECEPTIONIST', 'ADMIN'],
      }
    ]
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
    children:[
      {
        title: 'Cấp phát',
        path: '/pharmacy',
        icon: Pill,
        roles: ['PHARMACIST', 'ADMIN']
      },
      {
        title: 'Kho thuốc',
        path: '/inbound',
        icon: FileText, // Icon con (có thể bỏ qua nếu k cần)
            roles: ['PHARMACIST','ADMIN']
      },
    ]
  },
  {
    title: 'Cận lâm sàng (Lab/X-Ray)',
    path: '/technician/worklist',
    icon: Activity,
    roles: ['DOCTOR','TECHNICIAN', 'ADMIN'],
  },
  {
    title: 'Quản lý danh mục',
    icon: Database,
    roles: ['ADMIN'],
    children: [
        {
            title: 'Dịch vụ & Bảng giá',
            path: '/admin/services',
            icon: FileText, // Icon con (có thể bỏ qua nếu k cần)
            roles: ['ADMIN']
        },
        {
            title: 'Danh mục nhân viên',
            path: '/admin/staffs',
            icon: Pill,
            roles: ['ADMIN']
        },
        {
            title: 'Khoa / Phòng',
            path: '/admin/departments',
            icon: Users,
            roles: ['ADMIN']
        }
    ]
  },
  {
    title: 'Quản trị hệ thống',
    path: '/admin/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
];