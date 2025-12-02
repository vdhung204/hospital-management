import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  const userRoles = user.roles.map((r: string) => r.replace('ROLE_', ''));

  // Kiểm tra xem user có quyền nào nằm trong danh sách cho phép không
  const hasPermission = allowedRoles.some(role => userRoles.includes(role));

  if (!hasPermission) {
    // Nếu không có quyền -> đá về trang 403 hoặc Dashboard
    // Ở đây ta đá về dashboard cho đơn giản
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu có quyền -> Cho hiển thị nội dung bên trong (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;