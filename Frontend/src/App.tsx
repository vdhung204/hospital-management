import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/auth/LoginPage';
import MainLayout from '@/layout/MainLayout'
import ProtectedRoute from '@/components/ProtectedRouter'
import PatientPage from '@/pages/reception/PatientPage';
import DoctorQueuePage from './pages/doctor/DoctorQueuePage';
import MedicalExamPage from './pages/doctor/MedicalExamPage';
import TechnicianPage from './pages/technician/TechnicianPage';
import PharmacyPage from './pages/pharmacy/PharmacyPage';
import CashierPage from './pages/cashier/CashierPage';
import DashboardPage from './pages/admin/DashboardPage';
import ServiceManagementPage from './pages/manager/ServiceManagementPage';
import StaffPage from './pages/manager/StaffPage';
import InboundPage from './pages/pharmacy/InboundPage';
import AppointmentPage from './pages/reception/AppointmentPage';
import PatientLayout from './layout/PatientLayout';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalBooking from './pages/portal/PortalBooking';
import PortalHistoryDetail from './pages/portal/PortalHistoryDetail';
import PortalHistory from './pages/portal/PortalHistory';

// Import các trang chức năng (tạo placeholder trước)
const Settings = () => <div>Trang Cấu hình Admin</div>;

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        {/* Route Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route Có Layout & Cần đăng nhập */}
        <Route element={<MainLayout />}>
            
            {/* 1. Dashboard: Ai login rồi cũng vào được */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* 2. Nhóm route cho Lễ tân */}
            <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']} />}>
                <Route path="/reception/patients" element={<PatientPage />} />
                <Route path="/reception/appointments" element={<AppointmentPage />} />
                <Route path="/reception/billing" element={<CashierPage />} />
                {/* Thêm route thanh toán... */}
            </Route>

            {/* 3. Nhóm route cho Bác sĩ */}
            <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
                <Route path="/doctor/queue" element={<DoctorQueuePage />} />
                <Route path="/doctor/exam/:id" element={<MedicalExamPage />} />
                
            </Route>
            {/* Ky thuat vien */}
            <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN', 'ADMIN', 'DOCTOR']} />}>
                <Route path="/technician/worklist" element={<TechnicianPage />} />
            </Route>
            {/* 4. Nhóm route cho Dược sĩ */}
            <Route element={<ProtectedRoute allowedRoles={['PHARMACIST', 'ADMIN']} />}>
                <Route path="/pharmacy" element={<PharmacyPage />} />
                <Route path="/inbound" element={<InboundPage />} />
            </Route>

            {/* 5. Nhóm route Admin */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/admin/services" element={<ServiceManagementPage />} />
                <Route path="/admin/staffs" element={<StaffPage />} />
            </Route>
        </Route>
        {/* Patient Portal Routes */}
        <Route path="/portal" element={<PatientLayout />}>
          <Route path="dashboard" element={<PortalDashboard />} />
          <Route path="booking" element={<PortalBooking />} />
          <Route path="history" element={<PortalHistory />} />
          <Route path="history/:id" element={<PortalHistoryDetail />} />
        </Route>
        {/* Mặc định */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;