import React, { useEffect, useMemo, useState } from 'react';
import { Users, Plus, UserCheck, Briefcase, Lock, Edit2, X, RotateCcw, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { staffService, type StaffRegisterRequest } from '@/services/staffService';
import type { Department, Role, Staff } from '@/types/Staff';

const StaffPage = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]); // List khoa phòng
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  // Form Data khớp 100% với StaffRegisterRequest Backend
  const [formData, setFormData] = useState<StaffRegisterRequest>({
      username: '',
      password: '',
      fullName: '',
      gender: 'M',
      dateOfBirth: '',
      phone: '',
      email: '',
      idNumber: '',
      address: '',
      staffType: 'DOCTOR',
      position: '',
      departmentId: undefined,
      hireDate: new Date().toISOString().split('T')[0] // Mặc định hôm nay
  });
  // --- 1. STATE BỘ LỌC ---
  const [filters, setFilters] = useState({
      keyword: '',
      role: '',
      department: '',
      status: 'active' // Mặc định chỉ hiện Active cho gọn
  });
  useEffect(() => { 
      loadData();
      loadDepartments();
  }, []);

  const loadData = async () => {
      setLoading(true);
      try {
          const data = await staffService.getAll();
          setStaffs(data);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
  };

  const loadDepartments = async () => {
      try {
          const data = await staffService.getDepartments();
          setDepartments(data);
          const roles = await staffService.getRoles();
          setRoles(roles);
      } catch (e) { console.warn("Chưa load được khoa phòng",e); }
  };

  const filteredStaffs = useMemo(() => {
      return staffs.filter(staff => {
          // Lọc theo từ khóa (Tên, Mã, Username, SĐT)
          const searchLower = filters.keyword.toLowerCase();
          const matchKeyword = 
              staff.fullName.toLowerCase().includes(searchLower) ||
              staff.staffCode.toLowerCase().includes(searchLower) ||
              (staff.username && staff.username.toLowerCase().includes(searchLower)) ||
              (staff.phone && staff.phone.includes(searchLower));

          // Lọc theo Role
          const matchRole = filters.role ? staff.staffType === filters.role : true;

          // Lọc theo Khoa
          const matchDept = filters.department ? staff.departmentId === Number(filters.department) : true;

          // Lọc theo Trạng thái
          const matchStatus = 
              filters.status === 'all' ? true :
              filters.status === 'active' ? staff.active : !staff.active;

          return matchKeyword && matchRole && matchDept && matchStatus;
      });
  }, [staffs, filters]);

  // --- MỞ MODAL THÊM MỚI ---
  const handleOpenCreate = () => {
      setEditingStaffId(null); // Reset ID
      setFormData({ // Reset Form
          username: '', password: '', fullName: '', gender: 'M', dateOfBirth: '',
          phone: '', email: '', idNumber: '', address: '', staffType: 'DOCTOR',
          position: '', departmentId: undefined, hireDate: new Date().toISOString().split('T')[0]
      });
      setIsModalOpen(true);
  };

  // --- MỞ MODAL SỬA (FILL DATA) ---
  const handleOpenEdit = (staff: Staff) => {
      setEditingStaffId(staff.id);
      setFormData({
          username: staff.username,
          password: '', // Để trống, không hiện password cũ
          fullName: staff.fullName,
          gender: staff.gender || 'M',
          dateOfBirth: staff.dateOfBirth || '',
          phone: staff.phone || '',
          email: staff.email || '',
          idNumber: '', // Nếu API get all không trả về thì chịu, hoặc phải gọi API get detail
          address: staff.address || '',
          staffType: staff.staffType,
          position: staff.position || '',
          departmentId: staff.departmentId,
          hireDate: staff.hireDate || ''
      });
      setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          // Convert departmentId sang number nếu cần
          const payload = {
              ...formData,
              departmentId: formData.departmentId ? Number(formData.departmentId) : null
          };
          if (editingStaffId) {
              // UPDATE
              await staffService.update(editingStaffId, payload as StaffRegisterRequest);
              toast.success('Cập nhật nhân viên thành công!');
          } else {
              // CREATE
              await staffService.create(payload as StaffRegisterRequest);
              toast.success('Tạo nhân viên thành công!');
          }

          setIsModalOpen(false);
          loadData();
      } catch (error) {
        console.log(error);
        toast.error( 'Lỗi tạo nhân viên');
      }
  };
  
  // Hàm xử lý Toggle
  const handleToggleStatus = async (staff: Staff) => {
      const action = staff.active ? 'KHÓA' : 'KÍCH HOẠT';
      if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản của ${staff.fullName}?`)) return;
      
      try {
          await staffService.toggleStatus(staff.id);
          toast.success(`Đã ${action} nhân viên thành công`);
          loadData(); // Load lại danh sách
      } catch (error) {
          console.log(error);
          toast.error('Lỗi cập nhật trạng thái');
      }
  };

  // Hàm reset bộ lọc
  const resetFilters = () => {
      setFilters({ keyword: '', role: '', department: '', status: 'all' });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-blue-600"/> Quản lý Nhân sự
          </h1>
          <button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-transform active:scale-95">
              <Plus size={20}/> Thêm nhân viên
          </button>
      </div>
      {/* --- 3. THANH CÔNG CỤ LỌC (FILTER BAR) --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
              {/* Tìm kiếm từ khóa */}
              <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Tìm kiếm</label>
                  <div className="relative">
                      <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                      <input 
                          type="text" 
                          placeholder="Tên, Mã NV, SĐT..." 
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          value={filters.keyword}
                          onChange={e => setFilters({...filters, keyword: e.target.value})}
                      />
                  </div>
              </div>

              {/* Lọc Role */}
              <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Chức vụ</label>
                  <select 
                      className="w-full py-2 px-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      value={filters.role}
                      onChange={e => setFilters({...filters, role: e.target.value})}
                  >
                      <option value="">Tất cả</option>
                      {roles.length > 0 ? roles.filter(r => r.code != 'PATIENT').map(r =>(
                        <option value={r.code}>{r.name}</option>
                      )): ""}
                      
                  </select>
              </div>

              {/* Lọc Khoa */}
              <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Khoa / Phòng</label>
                  <select 
                      className="w-full py-2 px-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      value={filters.department}
                      onChange={e => setFilters({...filters, department: e.target.value})}
                  >
                      <option value="">Tất cả khoa phòng</option>
                      {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                  </select>
              </div>

              {/* Lọc Trạng thái */}
              <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Trạng thái</label>
                  <select 
                      className="w-full py-2 px-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      value={filters.status}
                      onChange={e => setFilters({...filters, status: e.target.value})}
                  >
                      <option value="all">Tất cả</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Đã khóa</option>
                  </select>
              </div>

              {/* Nút Reset */}
              <div className="md:col-span-1">
                  <button 
                      onClick={resetFilters}
                      className="w-full py-2 px-3 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors flex items-center justify-center"
                      title="Xóa bộ lọc"
                  >
                      <RotateCcw size={18}/>
                  </button>
              </div>
          </div>
      </div>
        {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                  <tr>
                      <th className="px-6 py-4">Mã NV</th>
                      <th className="px-6 py-4">Họ tên</th>
                      <th className="px-6 py-4">Chức vụ / Khoa</th>
                      <th className="px-6 py-4">Tài khoản</th>
                      <th className="px-6 py-4 text-center">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredStaffs.map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 font-mono text-blue-600 font-bold text-sm">
                              {staff.staffCode}
                          </td>
                          <td className="px-6 py-4">
                              <p className="font-bold text-slate-800 text-sm">{staff.fullName}</p>
                              <p className="text-xs text-slate-500">{staff.gender === 'M' ? 'Nam' : 'Nữ'} • {staff.dateOfBirth}</p>
                          </td>
                          <td className="px-6 py-4">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 bg-gray-100 text-gray-700">
                                  {staff.staffType}
                              </span>
                              <p className="text-xs text-slate-400">{staff.departmentName || '---'}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                              <div className="flex items-center gap-2">
                                  <UserCheck size={16} className="text-teal-600"/> 
                                  {staff.username}
                              </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                    <button 
                        onClick={() => handleToggleStatus(staff)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            staff.active ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 focus:ring-gray-300'
                        }`}
                        title={staff.active ? "Nhấn để Khóa" : "Nhấn để Kích hoạt"}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            staff.active ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                    {/* Label nhỏ bên dưới */}
                    <div className="text-[10px] font-bold mt-1 text-slate-400">
                        {staff.active ? 'Active' : 'Inactive'}
                    </div>
                </td>
                          <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleOpenEdit(staff)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Sửa">
                                      <Edit2 size={18}/>
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {staffs.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">Chưa có dữ liệu nhân viên.</div>}
      </div>
      </div>
        
      {/* --- MODAL FORM --- */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                      <h2 className="text-2xl font-bold text-slate-800">
                          {editingStaffId ? 'Cập nhật Nhân viên' : 'Thêm Nhân viên mới'}
                      </h2>
                      <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400 hover:text-slate-600"/></button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                      
                      {/* 1. TÀI KHOẢN */}
                      <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <UserCheck size={18}/> Tài khoản đăng nhập
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username <span className="text-red-500">*</span></label>
                                  <input required type="text" className="w-full p-2.5 border border-slate-300 rounded-lg bg-white disabled:bg-gray-100"
                                      placeholder="VD: nguyenva"
                                      disabled={!!editingStaffId} // Không cho sửa username khi edit
                                      value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}/>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                      {editingStaffId ? 'Mật khẩu mới (Bỏ trống nếu không đổi)' : 'Mật khẩu *'}
                                  </label>
                                  <div className="relative">
                                      <input 
                                          type="password" 
                                          required={!editingStaffId} // Bắt buộc khi tạo mới, không bắt buộc khi sửa
                                          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                          placeholder="******"
                                          value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                                      />
                                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 2. THÔNG TIN CÁ NHÂN */}
                      <div>
                          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Users size={18}/> Thông tin Cá nhân
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              <div className="md:col-span-1">
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                                  <input required type="text" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                      value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}/>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày sinh</label>
                                  <input type="date" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                                      value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}/>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giới tính</label>
                                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none"
                                      value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                      <option value="M">Nam</option>
                                      <option value="F">Nữ</option>
                                  </select>
                              </div>
                              {/* ... Các trường SĐT, Email, CCCD, Địa chỉ giữ nguyên như bài trước ... */}
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">SĐT</label>
                                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
                              </div>
                              <div className="md:col-span-2">
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                                  <input type="email" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                              </div>
                          </div>
                      </div>

                      {/* 3. CÔNG VIỆC */}
                      <div>
                          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Briefcase size={18}/> Thông tin Công việc
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vai trò (Role) <span className="text-red-500">*</span></label>
                                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none font-medium"
                                      value={formData.staffType} onChange={e => setFormData({...formData, staffType: e.target.value})}>
                                      {roles.filter(r => r.code != 'PATIENT').map(r =>(
                                        <option value={r.code}>{r.name}</option>
                                      ))}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chức danh / Vị trí</label>
                                  <input type="text" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                                      value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}/>
                              </div>
                              {/* ... Khoa phòng, Ngày tuyển dụng ... */}
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Khoa / Phòng</label>
                                  <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none"
                                      value={formData.departmentId || ''} onChange={e => setFormData({...formData, departmentId: Number(e.target.value)})}>
                                      <option value="">-- Chọn khoa phòng --</option>
                                      {departments.map(d => (
                                          <option key={d.id} value={d.id}>{d.name}</option>
                                      ))}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày tuyển dụng</label>
                                  <input type="date" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                                      value={formData.hireDate} onChange={e => setFormData({...formData, hireDate: e.target.value})}/>
                              </div>
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Hủy bỏ</button>
                          <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                              {loading ? 'Đang lưu...' : (editingStaffId ? 'Cập nhật' : 'Tạo mới')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default StaffPage;