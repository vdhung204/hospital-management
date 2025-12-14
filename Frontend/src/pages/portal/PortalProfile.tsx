// import { useEffect, useState } from 'react';
// import { User, Phone, MapPin, CreditCard, Calendar, Shield, LogOut } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { authService } from '@/services/authService';
// import type { CurrentUserResponse } from '@/types/auth';

// const PortalProfile = () => {
//   const [profile, setProfile] = useState<CurrentUserResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const data = await authService.getProfile();
//         setProfile(data);
//       } catch (error) {
//         toast.error('Lỗi tải hồ sơ');
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProfile();
//   }, []);

//   const handleLogout = () => {
//       localStorage.clear();
//       window.location.href = '/login';
//   };

//   if (loading) return <div className="p-10 text-center text-slate-400">Đang tải hồ sơ...</div>;
//   if (!profile) return null;

//   // Lấy data bệnh nhân từ response
//   const { patient } = profile;

//   return (
//     <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-10">
      
//       {/* 1. Header Card (Avatar + Tên) */}
//       <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 text-white shadow-lg flex items-center gap-5">
//           <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/50 backdrop-blur-sm">
//               {profile.fullName?.charAt(0) || 'U'}
//           </div>
//           <div>
//               <h1 className="text-2xl font-bold">{profile.fullName}</h1>
//               <p className="opacity-90 flex items-center gap-2 text-sm mt-1">
//                   <Shield size={14}/> Tài khoản Bệnh nhân
//               </p>
//           </div>
//       </div>

//       {/* 2. Thông tin chi tiết */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
//               <User size={18} className="text-teal-600"/> Thông tin cá nhân
//           </div>
          
//           <div className="p-6 space-y-4">
//               {/* Mã số */}
//               <div className="flex justify-between border-b border-dashed border-slate-100 pb-3">
//                   <span className="text-slate-500 text-sm">Mã bệnh nhân</span>
//                   <span className="font-mono font-bold text-teal-700">{patient?.patientCode || '---'}</span>
//               </div>

//               {/* Ngày sinh & Giới tính */}
//               <div className="grid grid-cols-2 gap-4 border-b border-dashed border-slate-100 pb-3">
//                   <div>
//                       <p className="text-slate-500 text-xs mb-1 flex items-center gap-1"><Calendar size={12}/> Ngày sinh</p>
//                       <p className="font-medium text-slate-800">
//                           {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('vi-VN') : '---'}
//                       </p>
//                   </div>
//                   <div>
//                       <p className="text-slate-500 text-xs mb-1">Giới tính</p>
//                       <p className="font-medium text-slate-800">
//                           {patient?.gender === 'M' ? 'Nam' : patient?.gender === 'F' ? 'Nữ' : 'Khác'}
//                       </p>
//                   </div>
//               </div>

//               {/* Liên hệ */}
//               <div className="space-y-3">
//                   <div className="flex items-start gap-3">
//                       <Phone size={18} className="text-slate-400 mt-0.5"/>
//                       <div>
//                           <p className="text-xs text-slate-500">Số điện thoại</p>
//                           <p className="font-medium text-slate-800">{patient?.phone || '---'}</p>
//                       </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                       <CreditCard size={18} className="text-slate-400 mt-0.5"/>
//                       <div>
//                           <p className="text-xs text-slate-500">CCCD / CMND</p>
//                           <p className="font-medium text-slate-800">{patient?.idNumber || '---'}</p>
//                       </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                       <MapPin size={18} className="text-slate-400 mt-0.5"/>
//                       <div>
//                           <p className="text-xs text-slate-500">Địa chỉ</p>
//                           <p className="font-medium text-slate-800">{patient?.address || '---'}</p>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </div>

//       {/* 3. Actions */}
//       <div className="grid grid-cols-1 gap-3">
//           <button 
//               className="w-full bg-white border border-slate-200 p-4 rounded-xl text-slate-600 font-bold hover:bg-slate-50 flex justify-between items-center group transition-all"
//               onClick={() => toast.info('Chức năng đổi mật khẩu đang phát triển')}
//           >
//               <span>Đổi mật khẩu</span>
//               <span className="text-slate-300 group-hover:text-slate-500">→</span>
//           </button>
          
//           <button 
//               onClick={handleLogout}
//               className="w-full bg-red-50 border border-red-100 p-4 rounded-xl text-red-600 font-bold hover:bg-red-100 flex justify-center items-center gap-2 transition-all"
//           >
//               <LogOut size={20}/> Đăng xuất
//           </button>
//       </div>

//     </div>
//   );
// };

// export default PortalProfile;

import { useEffect, useState, type ReactNode } from 'react';
import { User, Phone, MapPin, CreditCard, Calendar, Shield, LogOut, Edit3, Lock, X, Save, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '@/services/authService';
import type { ChangePasswordForm, CurrentUserResponse, UpdateProfileForm } from '@/types/auth';

// Định nghĩa kiểu dữ liệu cho Form


const PortalProfile = () => {
  const [profile, setProfile] = useState<CurrentUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State cho Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // State cho Forms
  const [editForm, setEditForm] = useState<UpdateProfileForm>({
    fullName: '', phone: '', address: '', gender: 'M', dateOfBirth: '', idNumber: '', email: ''
  });
  
  const [passForm, setPassForm] = useState<ChangePasswordForm>({
    oldPassword: '', newPassword: '', confirmPassword: ''
  });

  // Load data ban đầu
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
      // Map data vào form edit sẵn
      if (data.patient) {
        setEditForm({
          fullName: data.patient.fullName || '',
          phone: data.patient.phone || '',
          address: data.patient.address || '',
          gender: data.patient.gender || 'M',
          dateOfBirth: data.patient.dateOfBirth || '',
          idNumber: data.patient.idNumber || '',
          email: '' // Nếu backend có trả về email thì map vào đây
        });
      }
    } catch (error) {
      toast.error('Lỗi tải hồ sơ');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ CẬP NHẬT HỒ SƠ ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updatedProfile = await authService.updateProfile(editForm);
      setProfile(updatedProfile); // Cập nhật lại UI ngay lập tức
      toast.success('Cập nhật hồ sơ thành công!');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Cập nhật thất bại. Vui lòng thử lại.');
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  // --- XỬ LÝ ĐỔI MẬT KHẨU ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    setSubmitting(true);
    try {
      await authService.changePassword(passForm);
      toast.success('Đổi mật khẩu thành công!');
      setShowPasswordModal(false);
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.');
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    if(window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.clear();
        window.location.href = '/login';
    }
  };

  if (loading) return <div className="p-10 text-center text-teal-600 font-medium animate-pulse">Đang tải dữ liệu...</div>;
  if (!profile) return null;

  const { patient } = profile;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in">
      
      {/* 1. Header Card */}
      <div className="relative bg-gradient-to-r from-teal-600 to-emerald-500 rounded-3xl p-8 text-white shadow-xl shadow-teal-100 flex flex-col sm:flex-row items-center gap-6 overflow-hidden">
        {/* Background Pattern decoration */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl"></div>

        <div className="relative w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30 backdrop-blur-md shadow-inner">
          {profile.fullName?.charAt(0).toUpperCase() || 'U'}
        </div>
        
        <div className="text-center sm:text-left z-10">
          <h1 className="text-3xl font-bold tracking-tight">{profile.fullName}</h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 opacity-90 text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Shield size={14}/> Bệnh nhân
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <CreditCard size={14}/> {patient?.patientCode || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Thông tin chi tiết */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="font-bold text-slate-700 flex items-center gap-2 text-lg">
            <User size={20} className="text-teal-600"/> Thông tin cá nhân
          </div>
          <button 
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-full transition-all"
          >
            <Edit3 size={16}/> Chỉnh sửa
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <InfoItem icon={<CreditCard size={18}/>} label="Mã bệnh nhân" value={patient?.patientCode} highlight />
          <InfoItem icon={<Phone size={18}/>} label="Số điện thoại" value={patient?.phone} />
          <InfoItem 
            icon={<Calendar size={18}/>} 
            label="Ngày sinh" 
            value={patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('vi-VN') : null} 
          />
          <InfoItem 
            icon={<User size={18}/>} 
            label="Giới tính" 
            value={patient?.gender === 'M' ? 'Nam' : patient?.gender === 'F' ? 'Nữ' : 'Khác'} 
          />
          <InfoItem icon={<CreditCard size={18}/>} label="CCCD / CMND" value={patient?.idNumber} />
          <InfoItem icon={<MapPin size={18}/>} label="Địa chỉ" value={patient?.address} className="md:col-span-2" />
        </div>
      </div>

      {/* 3. Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => setShowPasswordModal(true)}
          className="bg-white border border-slate-200 p-5 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 hover:shadow-md flex items-center justify-between group transition-all"
        >
          <span className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                <Lock size={20} className="text-slate-500"/>
            </div>
            Đổi mật khẩu
          </span>
          <span className="text-slate-300 group-hover:text-slate-500">→</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="bg-white border border-red-100 p-5 rounded-2xl text-red-500 font-bold hover:bg-red-50 hover:border-red-200 hover:shadow-md flex items-center justify-between group transition-all"
        >
          <span className="flex items-center gap-3">
             <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                <LogOut size={20} className="text-red-500"/>
            </div>
            Đăng xuất
          </span>
          <span className="text-red-300 group-hover:text-red-500">→</span>
        </button>
      </div>

      {/* --- MODAL EDIT PROFILE --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Cập nhật thông tin</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500"><X size={20}/></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <FormInput label="Họ và tên" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                 <FormInput label="Số điện thoại" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                 <FormInput label="CMND/CCCD" value={editForm.idNumber} onChange={e => setEditForm({...editForm, idNumber: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <FormInput type="date" label="Ngày sinh" value={editForm.dateOfBirth} onChange={e => setEditForm({...editForm, dateOfBirth: e.target.value})} />
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Giới tính</label>
                    <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all bg-white"
                        value={editForm.gender}
                        onChange={e => setEditForm({...editForm, gender: e.target.value})}
                    >
                        <option value="M">Nam</option>
                        <option value="F">Nữ</option>
                        <option value="O">Khác</option>
                    </select>
                 </div>
              </div>
              <FormInput label="Địa chỉ" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
              
              <div className="pt-2 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Hủy</button>
                 <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    {submitting ? 'Đang lưu...' : <><Save size={18}/> Lưu thay đổi</>}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CHANGE PASSWORD --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><KeyRound size={20} className="text-teal-600"/> Đổi mật khẩu</h3>
              <button onClick={() => setShowPasswordModal(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500"><X size={20}/></button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <FormInput 
                type="password" 
                label="Mật khẩu hiện tại" 
                placeholder="••••••"
                value={passForm.oldPassword} 
                onChange={e => setPassForm({...passForm, oldPassword: e.target.value})} 
              />
              <FormInput 
                type="password" 
                label="Mật khẩu mới" 
                placeholder="••••••"
                value={passForm.newPassword} 
                onChange={e => setPassForm({...passForm, newPassword: e.target.value})} 
              />
              <FormInput 
                type="password" 
                label="Xác nhận mật khẩu mới" 
                placeholder="••••••"
                value={passForm.confirmPassword} 
                onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})} 
              />

              <div className="pt-2 flex justify-end gap-3">
                 <button type="button" onClick={() => setShowPasswordModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Hủy</button>
                 <button 
                    type="submit" 
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 shadow-lg shadow-teal-200 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    {submitting ? 'Đang xử lý...' : 'Xác nhận đổi'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Helper Components để code gọn hơn ---
  interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  // Định nghĩa rõ onChange nhận vào sự kiện thay đổi của thẻ Input
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string;
}
interface InfoItemProps {
  icon: ReactNode;         
  label: string;           
  value?: string | number | null; 
  highlight?: boolean;     
  className?: string;      
}

const InfoItem = ({ icon, label, value, highlight, className }: InfoItemProps) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className={`mt-0.5 ${highlight ? 'text-teal-600' : 'text-slate-400'}`}>{icon}</div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`font-medium text-base ${highlight ? 'text-teal-700 font-bold font-mono' : 'text-slate-800'}`}>
        {value || '---'}
      </p>
    </div>
  </div>
);

const FormInput = ({ label, type = "text", value, onChange, placeholder }:FormInputProps ) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
    <input 
      type={type}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all placeholder:text-slate-300"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
  </div>
);

export default PortalProfile;