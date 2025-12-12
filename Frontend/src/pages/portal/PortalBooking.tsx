
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { staffService } from '@/services/staffService';
import { appointmentService } from '@/services/appointmentService';
import type { Department, Doctor, MyAppointment } from '@/types/Portal';

const PortalBooking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Data Sources
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [myAppointments, setMyAppointments] = useState<MyAppointment[]>([]); // Dữ liệu lịch đã đặt

  // Selection State
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor| null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  
  // Logic State
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [isDuplicateDate, setIsDuplicateDate] = useState(false); // Cờ báo trùng lịch

  // 1. Load danh sách khoa & Lịch sử đặt hẹn (để check trùng)
  useEffect(() => {
      const loadInitialData = async () => {
          try {
              const [depts, appts] = await Promise.all([
                  staffService.getDepartments(),
                  appointmentService.getMyAppointments('upcoming') // Lấy lịch sắp tới để check
              ]);
              setDepartments(depts);
              setMyAppointments(appts);
          } catch (e) { toast.error('Lỗi tải dữ liệu');console.log(e); }
      };
      loadInitialData();
  }, []);

  // 2. Load bác sĩ khi chọn khoa
  useEffect(() => {
      if (selectedDept) {
          const loadDocs = async () => {
              try {
                const res = await staffService.getAll();
                  // Type assertion cho res và filter
                  const allStaff = res as Doctor[];
                  const filtered = allStaff.filter(s => s.staffType === 'DOCTOR' && s.departmentId === selectedDept.id);
                  setDoctors(filtered);
                  
                  setSelectedDoctor(null);
              } catch (e) { console.error(e); }
          };
          loadDocs();
      } else {
          setDoctors([]);
      }
  }, [selectedDept]);

  // 3. Load Slot & Check trùng ngày
  useEffect(() => {
      // Reset trạng thái
      setTimeSlots([]);
      setIsDuplicateDate(false);
      setSelectedTime('');

      if (selectedDoctor && selectedDate) {
          // A. Check trùng ngày trước khi gọi API slot
          const checkDate = new Date(selectedDate).toDateString();
          const hasDuplicate = myAppointments.some(appt => 
              new Date(appt.scheduledAt).toDateString() === checkDate && appt.status !== 'CANCELLED'
          );

          if (hasDuplicate) {
              setIsDuplicateDate(true);
              return; // Dừng lại, không load slot nữa
          }

          // B. Nếu không trùng -> Load Slot
          const loadSlots = async () => {
              try {
                  const slots = await appointmentService.getSlots(selectedDoctor.id, selectedDate);
                  setTimeSlots(slots);
              } catch (e) {
                  console.error(e);
                  toast.error("Không tải được lịch trống");
              }
          };
          loadSlots();
      }
  }, [selectedDoctor, selectedDate, myAppointments]);

  // Hàm chọn bác sĩ mặc định (Xử lý Type cho object tự tạo)
  const handleSelectDefaultDoctor = () => {
      if (doctors.length > 0) {
          const defaultDoc: Doctor = {
              ...doctors[0], 
              fullName: 'Bác sĩ trực (Mặc định)',
              staffCode: 'DEFAULT' 
          };
          setSelectedDoctor(defaultDoc);
      }
  };
  // --- HANDLERS ---
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
      if (!selectedDate || !selectedTime) return toast.warning('Vui lòng chọn thời gian!');
      
      setLoading(true);
      try {
          const isoDateTime = `${selectedDate}T${selectedTime}:00`;
          
          await appointmentService.createForPatient({
              departmentId: selectedDept?.id,
              doctorId: selectedDoctor?.id,
              scheduledAt: isoDateTime,
              reason: reason
          });

          toast.success('Đặt lịch thành công!');
          navigate('/portal/dashboard');
      } catch (error) {
          toast.error('Lỗi đặt lịch. Vui lòng thử lại.');
          console.log(error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-[500px] rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      
      {/* Header Progress */}
      <div className="bg-teal-600 p-6 text-white">
          <h1 className="text-xl font-bold mb-1">Đặt lịch khám bệnh</h1>
          <p className="text-teal-100 text-sm opacity-90">Bước {step}/3</p>
          <div className="h-1 bg-teal-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-yellow-400 transition-all duration-500" style={{width: `${(step/3)*100}%`}}></div>
          </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
          
          {/* --- BƯỚC 1: CHỌN KHOA & BÁC SĨ --- */}
          {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs">1</div>
                          Chọn Chuyên khoa
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {departments.map(dept => (
                              <div key={dept.id} 
                                  onClick={() => { setSelectedDept(dept); setSelectedDoctor(null); }}
                                  className={`p-3 border rounded-xl cursor-pointer transition-all text-center ${
                                      selectedDept?.id === dept.id 
                                      ? 'border-teal-500 bg-teal-50 text-teal-700 font-bold shadow-sm' 
                                      : 'border-slate-200 hover:border-teal-300 text-slate-600'
                                  }`}
                              >
                                  {dept.name}
                              </div>
                          ))}
                      </div>
                  </div>

                  {selectedDept && (
                      <div className="animate-fade-in">
                          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                              <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs">2</div>
                              Chọn Bác sĩ
                          </label>
                          
                          {/* LOGIC HIỂN THỊ KHI KHÔNG CÓ BÁC SĨ */}
                          {doctors.length === 0 ? (
                              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3 text-orange-700">
                                  <AlertCircle size={20}/>
                                  <span className="text-sm font-medium">Hiện tại khoa này chưa có bác sĩ nào nhận lịch. Vui lòng chọn khoa khác.</span>
                              </div>
                          ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {/* Tùy chọn Bác sĩ mặc định */}
                                  <div 
                                      onClick={handleSelectDefaultDoctor} 
                                      className={`p-3 border rounded-xl cursor-pointer flex items-center gap-3 ${
                                          selectedDoctor?.fullName === 'Bác sĩ trực (Mặc định)'
                                          ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                                          : 'border-slate-200'
                                      }`}
                                  >
                                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500"><User size={20}/></div>
                                      <div>
                                          <p className="font-bold text-sm text-slate-700">Bác sĩ ngẫu nhiên</p>
                                          <p className="text-xs text-slate-500">Do bệnh viện sắp xếp</p>
                                      </div>
                                  </div>

                                  {doctors.map(doc => (
                                      <div key={doc.id} 
                                          onClick={() => setSelectedDoctor(doc)}
                                          className={`p-3 border rounded-xl cursor-pointer flex items-center gap-3 ${
                                              selectedDoctor?.id === doc.id && selectedDoctor.fullName !== 'Bác sĩ trực (Mặc định)'
                                              ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                                              : 'border-slate-200 hover:bg-slate-50'
                                          }`}
                                      >
                                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                              {doc.fullName.charAt(0)}
                                          </div>
                                          <div>
                                              <p className="font-bold text-sm text-slate-700">{doc.fullName}</p>
                                              <p className="text-xs text-slate-500">{doc.staffCode}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  )}
              </div>
          )}

          {/* --- BƯỚC 2: CHỌN NGÀY GIỜ --- */}
          {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Ngày muốn khám</label>
                      <input 
                          type="date" 
                          className={`w-full p-3 border rounded-xl outline-none font-medium text-slate-700 ${isDuplicateDate ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-300 focus:border-teal-500'}`}
                          value={selectedDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                      />
                      
                      {/* CẢNH BÁO TRÙNG LỊCH */}
                      {isDuplicateDate && (
                          <div className="mt-2 text-red-600 text-sm flex items-center gap-2 animate-pulse">
                              <AlertCircle size={16}/>
                              Bạn đã có lịch hẹn khám vào ngày này rồi. Vui lòng chọn ngày khác.
                          </div>
                      )}
                  </div>

                  {!isDuplicateDate && selectedDate && (
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3">Khung giờ còn trống</label>
                          {timeSlots.length > 0 ? (
                              <div className="grid grid-cols-4 gap-3">
                                  {timeSlots.map(time => (
                                      <button key={time}
                                          onClick={() => setSelectedTime(time)}
                                          className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                              selectedTime === time
                                              ? 'bg-teal-600 text-white shadow-md'
                                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                          }`}
                                      >
                                          {time}
                                      </button>
                                  ))}
                              </div>
                          ) : (
                              <p className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300">
                                  Bác sĩ đã kín lịch hoặc không làm việc vào ngày này.
                              </p>
                          )}
                      </div>
                  )}

                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Lý do khám / Triệu chứng</label>
                      <textarea 
                          rows={3}
                          className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-teal-500 text-sm"
                          placeholder="VD: Đau bụng, sốt cao 2 ngày nay..."
                          value={reason}
                          onChange={e => setReason(e.target.value)}
                      ></textarea>
                  </div>
              </div>
          )}

          {/* BƯỚC 3 GIỮ NGUYÊN ... */}
                    {step === 3 && (
              <div className="space-y-6 animate-fade-in text-center">
                  <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32}/>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Xác nhận thông tin đặt lịch</h3>
                  
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500 text-sm">Chuyên khoa</span>
                          <span className="font-bold text-slate-800">{selectedDept?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500 text-sm">Bác sĩ</span>
                          <span className="font-bold text-slate-800">{selectedDoctor ? selectedDoctor.fullName : 'Mặc định'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                          <span className="text-slate-500 text-sm">Ngày hẹn</span>
                          <span className="font-bold text-teal-700">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-slate-500 text-sm">Giờ hẹn</span>
                          <span className="font-bold text-teal-700 text-lg">{selectedTime}</span>
                      </div>
                  </div>

                  <p className="text-xs text-slate-500 italic">
                      * Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục tiếp đón.
                  </p>
              </div>
          )}

      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between">
          {step > 1 ? (
              <button onClick={handleBack} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-white transition flex items-center gap-2">
                  <ChevronLeft size={18}/> Quay lại
              </button>
          ) : (
              <div></div>
          )}

          {step < 3 ? (
              <button 
                  onClick={handleNext} 
                  disabled={
                      !selectedDept || // Chưa chọn khoa
                      (doctors.length === 0) || // Khoa không có bác sĩ
                      !selectedDoctor || // Chưa chọn bác sĩ
                      (step===2 && (isDuplicateDate || !selectedDate || !selectedTime)) // Bước 2 chưa xong
                  }
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:shadow-none transition flex items-center gap-2"
              >
                  Tiếp tục <ChevronRight size={18}/>
              </button>
          ) : (
              <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                  {loading ? 'Đang gửi...' : 'Xác nhận Đặt lịch'}
              </button>
          )}
      </div>

    </div>
  );
};

export default PortalBooking;