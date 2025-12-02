// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/auth/LoginPage';
import MainLayout from '@/layout/MainLayout'
import ProtectedRoute from '@/components/ProtectedRouter'
import PatientPage from '@/pages/reception/PatientPage';

// Import các trang chức năng (tạo placeholder trước)
const Dashboard = () => <div>Trang Dashboard Thống kê</div>;
const DoctorQueue = () => <div>Trang Danh sách chờ khám của Bác sĩ</div>;
const Pharmacy = () => <div>Trang Kho dược & Cấp phát</div>;
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
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* 2. Nhóm route cho Lễ tân */}
            <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']} />}>
                <Route path="/reception/patients" element={<PatientPage />} />
                {/* Thêm route thanh toán... */}
            </Route>

            {/* 3. Nhóm route cho Bác sĩ */}
            <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
                <Route path="/doctor/queue" element={<DoctorQueue />} />
            </Route>

            {/* 4. Nhóm route cho Dược sĩ */}
            <Route element={<ProtectedRoute allowedRoles={['PHARMACIST', 'ADMIN']} />}>
                <Route path="/pharmacy" element={<Pharmacy />} />
            </Route>

            {/* 5. Nhóm route Admin */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/settings" element={<Settings />} />
            </Route>

        </Route>

        {/* Mặc định */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;