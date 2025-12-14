
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
    Calendar, Clock, Plus, Search, User, CheckCircle, XCircle, MapPin,  RotateCcw 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { appointmentService } from '@/services/appointmentService';
import { patientService } from '@/services/patientService';
import { staffService } from '@/services/staffService';

import type { 
    Appointment, 
    PatientOption, 
    DoctorOption, 
    DepartmentOption,
    CreateAppointmentRequest,
    AppointmentStatus
} from '@/types/Appointment';

// Interface cho Form Đặt lịch
interface AppointmentFormState {
    patientId: string;
    departmentId: string;
    doctorId: string;
    scheduledDate: string;
    scheduledTime: string;
}

const AppointmentPage = () => {
  // --- DATA STATES ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // --- FILTER STATES ---
  const [filters, setFilters] = useState({
      keyword: '',        
      fromDate: new Date().toISOString().split('T')[0], 
      toDate: new Date().toISOString().split('T')[0],   
      status: '',           
      doctorId: ''        
  });

  // --- MASTER DATA---
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);

  // --- MODAL STATE ---
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<AppointmentFormState>({
      patientId: '', departmentId: '', doctorId: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '08:00'
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // --- LOAD MASTER DATA---
  useEffect(() => {
      const initMasterData = async () => {
          try {
              const [deptRes, staffRes, patRes] = await Promise.all([
                  staffService.getDepartments(),
                  staffService.getAll(),
                  patientService.getAll()
              ]);
              setDepartments(deptRes as DepartmentOption[]);
              setDoctors((staffRes as DoctorOption[]).filter(s => s.staffType === 'DOCTOR') as DoctorOption[]);
              setPatients(patRes as PatientOption[]);
          } catch (e) { console.error("Lỗi load danh mục");console.log(e); }
      };
      initMasterData();
  }, []);

  useEffect(() => {
    if (showModal && formData.doctorId && formData.scheduledDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const slots = await appointmentService.getSlots(Number(formData.doctorId), formData.scheduledDate);
          setAvailableSlots(slots);
        } catch (error) {
          console.error(error);
          setAvailableSlots([]); // Reset nếu lỗi
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    } else {
      setAvailableSlots([]); // Reset nếu chưa chọn đủ
    }
  }, [formData.doctorId, formData.scheduledDate, showModal]);
  // --- LOAD DANH SÁCH---
  const loadAppointments = useCallback(async () => {
      setLoading(true);
      try {
          const data = await appointmentService.search({
              fromDate: filters.fromDate,
              toDate: filters.toDate,
              status: filters.status as AppointmentStatus || undefined,
              doctorId: filters.doctorId ? Number(filters.doctorId) : undefined
          });
          
          setAppointments(data.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()));
      } catch (e) { toast.error('Lỗi tải dữ liệu');console.log(e); }
      finally { setLoading(false); }
  }, [filters.fromDate, filters.toDate, filters.status, filters.doctorId]); 

  useEffect(() => {
      loadAppointments();
  }, [loadAppointments]);

  const displayAppointments = useMemo(() => {
      if (!filters.keyword) return appointments;
      const lowerKey = filters.keyword.toLowerCase();
      return appointments.filter(a => 
          a.patientName.toLowerCase().includes(lowerKey) || 
          a.patientCode.toLowerCase().includes(lowerKey)
      );
  }, [appointments, filters.keyword]);


  // --- HANDLERS ---
  const handleCheckIn = async (appt: Appointment) => {
      const apptDate = new Date(appt.scheduledAt);
      const today = new Date();
      if (apptDate.getDate() !== today.getDate() || apptDate.getMonth() !== today.getMonth()) {
          toast.warning('Chỉ có thể tiếp đón lịch hẹn của ngày hôm nay!');
          return;
      }

      if (!window.confirm(`Tiếp đón bệnh nhân ${appt.patientName}?`)) return;
      try {
          await appointmentService.checkIn(appt.id);
          toast.success('Đã tạo hồ sơ khám thành công!');
          loadAppointments(); 
      } catch (e) { toast.error('Lỗi tiếp đón');console.log(e); }
  };

  const handleCancel = async (id: number) => {
      if (!window.confirm('Hủy lịch hẹn này?')) return;
      try {
          await appointmentService.cancel(id);
          toast.info('Đã hủy lịch hẹn');
          loadAppointments();
      } catch (e) { toast.error('Lỗi hủy');console.log(e); }
  };

  const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          if(!formData.patientId) return toast.warning("Vui lòng chọn bệnh nhân");
          
          // Check quá khứ
          const inputDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
          if (inputDateTime < new Date()) return toast.warning("Không thể đặt lịch trong quá khứ!");

          const isoDateTime = `${formData.scheduledDate}T${formData.scheduledTime}:00`;
          
          const payload: CreateAppointmentRequest = {
              patientId: Number(formData.patientId),
              departmentId: formData.departmentId ? Number(formData.departmentId) : null,
              doctorId: formData.doctorId ? Number(formData.doctorId) : null,
              scheduledAt: isoDateTime
          };
          
          await appointmentService.create(payload);
          toast.success('Đặt lịch thành công');
          setShowModal(false);
          
          // Logic reload thông minh
          if (formData.scheduledDate >= filters.fromDate && formData.scheduledDate <= filters.toDate) {
              loadAppointments()
          } else {
              if(window.confirm("Lịch hẹn đã được tạo vào ngày khác. Bạn có muốn chuyển bộ lọc đến ngày đó không?")) {
                  setFilters(prev => ({ ...prev, fromDate: formData.scheduledDate, toDate: formData.scheduledDate }));
              }
          }
          
          setFormData(prev => ({...prev, patientId: ''}));
      } catch (e) { toast.error('Lỗi tạo lịch hẹn');console.log(e); }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
          <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="text-blue-600"/> Quản lý Lịch hẹn
              </h1>
              <p className="text-slate-500 text-sm">Theo dõi và tiếp nhận bệnh nhân đặt trước</p>
          </div>
          <button 
              onClick={() => {
                  setFormData(prev => ({...prev, patientId: '', scheduledDate: new Date().toISOString().split('T')[0] }));
                  setShowModal(true);
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
              <Plus size={20}/> Đặt lịch mới
          </button>
      </div>

      {/* FILTER BAR (THANH LỌC) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Ngày tháng */}
          <div className="md:col-span-4 grid grid-cols-2 gap-2">
              <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Từ ngày</label>
                  <input type="date" className="w-full p-2 border rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                      value={filters.fromDate} onChange={e => setFilters({...filters, fromDate: e.target.value})} />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Đến ngày</label>
                  <input type="date" className="w-full p-2 border rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
                      value={filters.toDate} onChange={e => setFilters({...filters, toDate: e.target.value})} />
              </div>
          </div>

          {/* Trạng thái & Bác sĩ */}
          <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Trạng thái</label>
              <select className="w-full p-2 border rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                  value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                  <option value="">Tất cả</option>
                  <option value="SCHEDULED">Chờ khám</option>
                  <option value="COMPLETED">Đã tiếp nhận</option>
                  <option value="CANCELLED">Đã hủy</option>
              </select>
          </div>
          <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Bác sĩ</label>
              <select className="w-full p-2 border rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                  value={filters.doctorId} onChange={e => setFilters({...filters, doctorId: e.target.value})}>
                  <option value="">Tất cả</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
              </select>
          </div>

          {/* Tìm kiếm tên */}
          <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Tìm bệnh nhân</label>
              <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                  <input type="text" placeholder="Tên hoặc Mã BN..." 
                      className="w-full pl-9 pr-3 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      value={filters.keyword} onChange={e => setFilters({...filters, keyword: e.target.value})} />
              </div>
          </div>

          {/* Reset */}
          <div className="md:col-span-1">
              <button 
                  onClick={() => setFilters({
                      keyword: '', doctorId: '', status: '',
                      fromDate: new Date().toISOString().split('T')[0],
                      toDate: new Date().toISOString().split('T')[0]
                  })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 flex justify-center"
                  title="Đặt lại bộ lọc"
              >
                  <RotateCcw size={18}/>
              </button>
          </div>
      </div>

      {/* LIST VIEW */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
          {loading ? (
              <div className="flex justify-center items-center h-64 text-slate-400">Đang tải dữ liệu...</div>
          ) : displayAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Clock size={48} className="mb-4 opacity-20"/>
                  <p>Không tìm thấy lịch hẹn nào phù hợp.</p>
              </div>
          ) : (
              <div className="divide-y divide-slate-100">
                  {displayAppointments.map((appt) => {
                      const isWaiting = appt.status === 'SCHEDULED';
                      const time = new Date(appt.scheduledAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
                      const dateDisplay = new Date(appt.scheduledAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'});

                      return (
                          <div key={appt.id} className={`p-5 flex flex-col md:flex-row items-center gap-6 transition-colors ${isWaiting ? 'hover:bg-blue-50/30' : 'opacity-60 bg-slate-50'}`}>
                              
                              {/* Time Column */}
                              <div className="flex flex-col items-center min-w-[100px] border-r border-slate-100 pr-6 text-center">
                                  <span className="text-xl font-bold text-slate-700">{time}</span>
                                  <span className="text-xs text-slate-500 font-medium mb-1">{dateDisplay}</span>
                                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                      appt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                                      appt.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                      'bg-red-100 text-red-700'
                                  }`}>
                                      {appt.status === 'SCHEDULED' ? 'Chờ đến' : 
                                       appt.status === 'COMPLETED' ? 'Đã tiếp' : appt.status}
                                  </span>
                              </div>

                              {/* Info Column */}
                              <div className="flex-1 space-y-1 w-full">
                                  <div className="flex items-center gap-2">
                                      <h3 className="text-lg font-bold text-slate-800">{appt.patientName}</h3>
                                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                                          {appt.patientCode}
                                      </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                      <span className="flex items-center gap-1">
                                          <MapPin size={14}/> {appt.departmentName || 'Chưa chỉ định khoa'}
                                      </span>
                                      <span className="flex items-center gap-1">
                                          <User size={14}/> {appt.doctorName ? `BS. ${appt.doctorName}` : 'Bác sĩ trực'}
                                      </span>
                                  </div>
                              </div>

                              {/* Action Column */}
                              {/* <div className="flex gap-3">
                                  {isWaiting ? (
                                      <>
                                          {isToday ? (
                                              <button onClick={() => handleCheckIn(appt)} 
                                                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm flex items-center gap-2 transition-transform active:scale-95">
                                                  <CheckCircle size={18}/> Tiếp đón
                                              </button>
                                          ) : (
                                              <span className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold border">
                                                  Chưa đến ngày
                                              </span>
                                          )}
                                          
                                          <button onClick={() => handleCancel(appt.id)}
                                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                              title="Hủy lịch">
                                              <XCircle size={20}/>
                                          </button>
                                      </>
                                  ) : (
                                      <span className="text-sm font-medium text-slate-400 italic flex items-center gap-1">
                                          {appt.status === 'COMPLETED' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                          {appt.status === 'COMPLETED' ? 'Đã tạo hồ sơ' : 'Đã hủy'}
                                      </span>
                                  )}
                              </div> */}
                              {/* Action Column */}
                                <div className="flex gap-3">
                                    {(() => {
                                        // 1. Lấy ngày hẹn (chỉ lấy phần ngày, bỏ qua giờ phút để so sánh)
                                        const apptDate = new Date(appt.scheduledAt);
                                        const apptDateOnly = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate()).getTime();

                                        // 2. Lấy ngày hôm nay (chỉ lấy phần ngày)
                                        const now = new Date();
                                        const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

                                        // 3. Logic so sánh
                                        const isToday = apptDateOnly === todayOnly;
                                        const isPast = apptDateOnly < todayOnly;

                                        if (isWaiting) {
                                            return (
                                                <>
                                                    {/* TRƯỜNG HỢP 1: ĐÚNG NGÀY -> Hiện nút Check-in */}
                                                    {isToday && (
                                                        <button onClick={() => handleCheckIn(appt)} 
                                                            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm flex items-center gap-2 transition-transform active:scale-95">
                                                            <CheckCircle size={18}/> Tiếp đón
                                                        </button>
                                                    )}

                                                    {/* TRƯỜNG HỢP 2: QUÁ KHỨ -> Hiện "Đã quá hạn" */}
                                                    {isPast && (
                                                        <span className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold border border-gray-200 cursor-not-allowed">
                                                            Đã quá hạn
                                                        </span>
                                                    )}

                                                    {/* TRƯỜNG HỢP 3: TƯƠNG LAI -> Hiện "Chưa đến ngày" */}
                                                    {!isToday && !isPast && (
                                                        <span className="px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold border border-orange-100 cursor-not-allowed">
                                                            Chưa đến ngày
                                                        </span>
                                                    )}
                                                    
                                                    {/* Nút Hủy luôn hiện để có thể hủy lịch sai/cũ */}
                                                    <button onClick={() => handleCancel(appt.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hủy lịch">
                                                        <XCircle size={20}/>
                                                    </button>
                                                </>
                                            );
                                        } else {
                                            // Đã hoàn thành hoặc Đã hủy
                                            return (
                                                <span className={`text-sm font-medium italic flex items-center gap-1 ${
                                                    appt.status === 'COMPLETED' ? 'text-green-600' : 'text-slate-400'
                                                }`}>
                                                    {appt.status === 'COMPLETED' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                                    {appt.status === 'COMPLETED' ? 'Đã tiếp nhận' : 'Đã hủy'}
                                                </span>
                                            );
                                        }
                                    })()}
                                </div>
                          </div>
                      );
                  })}
              </div>
          )}
      </div>

      {/* MODAL GIỮ NGUYÊN NHƯ CŨ */}
      {/* {showModal && (
          // ... Code Modal Create ...
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Đặt lịch hẹn mới</h3>
                  <form onSubmit={handleCreate} className="space-y-4">
                      
                      {/* Chọn BN *
                      <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Bệnh nhân <span className="text-red-500">*</span></label>
                          <select required className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                              <option value="">-- Chọn bệnh nhân --</option>
                              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} - {p.patientCode}</option>)}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Ngày hẹn</label>
                              <input type="date" className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                  value={formData.scheduledDate} onChange={e => setFormData({...formData, scheduledDate: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Giờ hẹn <span className="text-red-500">*</span></label>
                              <input type="time" required className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                  value={formData.scheduledTime} onChange={e => setFormData({...formData, scheduledTime: e.target.value})} />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Khoa khám</label>
                              <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none"
                                  value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
                                  <option value="">-- Tùy chọn --</option>
                                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Bác sĩ (Tùy chọn)</label>
                              <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none"
                                  value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})}>
                                  <option value="">-- Mặc định --</option>
                                  {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
                              </select>
                          </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-sm font-medium">Hủy bỏ</button>
                          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg active:scale-95 transition-transform text-sm">Lưu lịch hẹn</button>
                      </div>
                  </form>
              </div>
          </div>
      )} */}

      {/* MODAL CẬP NHẬT */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                  <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Đặt lịch hẹn mới</h3>
                  <form onSubmit={handleCreate} className="space-y-4">
                      
                      {/* Chọn BN */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Bệnh nhân <span className="text-red-500">*</span></label>
                          <select required className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                              <option value="">-- Chọn bệnh nhân --</option>
                              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} - {p.patientCode}</option>)}
                          </select>
                      </div>

                      {/* Chọn Khoa & Bác sĩ */}
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Khoa khám</label>
                              <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none"
                                  value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})}>
                                  <option value="">-- Tùy chọn --</option>
                                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Bác sĩ</label>
                              <select className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                  value={formData.doctorId} 
                                  onChange={e => {
                                      setFormData({...formData, doctorId: e.target.value, scheduledTime: ''}); // Reset giờ khi đổi bác sĩ
                                  }}
                              >
                                  <option value="">-- Chọn bác sĩ --</option>
                                  {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
                              </select>
                          </div>
                      </div>

                      {/* Chọn Ngày */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Ngày hẹn</label>
                          <input type="date" className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.scheduledDate} 
                              onChange={e => {
                                  setFormData({...formData, scheduledDate: e.target.value, scheduledTime: ''}); // Reset giờ khi đổi ngày
                              }} 
                          />
                      </div>

                      {/* KHU VỰC CHỌN GIỜ (SLOTS) */}
                      <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Giờ hẹn <span className="text-red-500">*</span></label>
                          
                          {/* Trường hợp 1: Chưa chọn bác sĩ -> Cho nhập tay */}
                          {!formData.doctorId ? (
                              <div>
                                  <input type="time" required className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                      value={formData.scheduledTime} onChange={e => setFormData({...formData, scheduledTime: e.target.value})} />
                                  <p className="text-xs text-slate-400 mt-1 italic">* Chọn bác sĩ để xem giờ trống chính xác.</p>
                              </div>
                          ) : (
                              /* Trường hợp 2: Đã chọn bác sĩ -> Hiện Grid Slots */
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                  {loadingSlots ? (
                                      <div className="text-center text-sm text-slate-500 py-4">Đang kiểm tra lịch trống...</div>
                                  ) : availableSlots.length > 0 ? (
                                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                          {availableSlots.map(slot => (
                                              <button
                                                  key={slot}
                                                  type="button"
                                                  onClick={() => setFormData({...formData, scheduledTime: slot})}
                                                  className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                                                      formData.scheduledTime === slot 
                                                          ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                                                          : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                                                  }`}
                                              >
                                                  {slot}
                                              </button>
                                          ))}
                                      </div>
                                  ) : (
                                      <div className="text-center py-4">
                                          <p className="text-sm text-red-500 font-medium">Không còn giờ trống!</p>
                                          <p className="text-xs text-slate-400">Vui lòng chọn ngày khác hoặc bác sĩ khác.</p>
                                      </div>
                                  )}
                                  
                                  {/* Hiển thị giờ đã chọn */}
                                  {formData.scheduledTime && (
                                      <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                                          <span className="text-xs text-slate-500">Giờ đã chọn:</span>
                                          <span className="text-lg font-bold text-blue-700">{formData.scheduledTime}</span>
                                      </div>
                                  )}
                              </div>
                          )}
                      </div>

                      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-sm font-medium">Hủy bỏ</button>
                          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg active:scale-95 transition-transform text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!!formData.doctorId && !formData.scheduledTime} // Disable nếu chọn BS mà chưa chọn giờ
                          >
                              Lưu lịch hẹn
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AppointmentPage;