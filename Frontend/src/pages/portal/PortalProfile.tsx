import React, { useEffect, useState } from 'react';
import { User, Phone, MapPin, CreditCard, Calendar, Shield, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '@/services/authService';

const PortalProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (error) {
        toast.error('Lỗi tải hồ sơ');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = () => {
      localStorage.clear();
      window.location.href = '/login';
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Đang tải hồ sơ...</div>;
  if (!profile) return null;

  // Lấy data bệnh nhân từ response
  const { patient } = profile;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* 1. Header Card (Avatar + Tên) */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 text-white shadow-lg flex items-center gap-5">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/50 backdrop-blur-sm">
              {profile.fullName?.charAt(0) || 'U'}
          </div>
          <div>
              <h1 className="text-2xl font-bold">{profile.fullName}</h1>
              <p className="opacity-90 flex items-center gap-2 text-sm mt-1">
                  <Shield size={14}/> Tài khoản Bệnh nhân
              </p>
          </div>
      </div>

      {/* 2. Thông tin chi tiết */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
              <User size={18} className="text-teal-600"/> Thông tin cá nhân
          </div>
          
          <div className="p-6 space-y-4">
              {/* Mã số */}
              <div className="flex justify-between border-b border-dashed border-slate-100 pb-3">
                  <span className="text-slate-500 text-sm">Mã bệnh nhân</span>
                  <span className="font-mono font-bold text-teal-700">{patient?.patientCode || '---'}</span>
              </div>

              {/* Ngày sinh & Giới tính */}
              <div className="grid grid-cols-2 gap-4 border-b border-dashed border-slate-100 pb-3">
                  <div>
                      <p className="text-slate-500 text-xs mb-1 flex items-center gap-1"><Calendar size={12}/> Ngày sinh</p>
                      <p className="font-medium text-slate-800">
                          {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
                      </p>
                  </div>
                  <div>
                      <p className="text-slate-500 text-xs mb-1">Giới tính</p>
                      <p className="font-medium text-slate-800">
                          {patient?.gender === 'M' ? 'Nam' : patient?.gender === 'F' ? 'Nữ' : 'Khác'}
                      </p>
                  </div>
              </div>

              {/* Liên hệ */}
              <div className="space-y-3">
                  <div className="flex items-start gap-3">
                      <Phone size={18} className="text-slate-400 mt-0.5"/>
                      <div>
                          <p className="text-xs text-slate-500">Số điện thoại</p>
                          <p className="font-medium text-slate-800">{patient?.phone || '---'}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <CreditCard size={18} className="text-slate-400 mt-0.5"/>
                      <div>
                          <p className="text-xs text-slate-500">CCCD / CMND</p>
                          <p className="font-medium text-slate-800">{patient?.idNumber || '---'}</p>
                      </div>
                  </div>
                  <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-slate-400 mt-0.5"/>
                      <div>
                          <p className="text-xs text-slate-500">Địa chỉ</p>
                          <p className="font-medium text-slate-800">{patient?.address || '---'}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 3. Actions */}
      <div className="grid grid-cols-1 gap-3">
          <button 
              className="w-full bg-white border border-slate-200 p-4 rounded-xl text-slate-600 font-bold hover:bg-slate-50 flex justify-between items-center group transition-all"
              onClick={() => toast.info('Chức năng đổi mật khẩu đang phát triển')}
          >
              <span>Đổi mật khẩu</span>
              <span className="text-slate-300 group-hover:text-slate-500">→</span>
          </button>
          
          <button 
              onClick={handleLogout}
              className="w-full bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 font-bold hover:bg-red-100 flex justify-center items-center gap-2 transition-all"
          >
              <LogOut size={20}/> Đăng xuất
          </button>
      </div>

    </div>
  );
};

export default PortalProfile;