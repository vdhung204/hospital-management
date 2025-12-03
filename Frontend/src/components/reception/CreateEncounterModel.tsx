import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { X, Stethoscope } from 'lucide-react';
import { encounterService } from '../../services/encounterService';
import type { Department, EncounterCreateRequest, Staff } from '@/types/Encounter';
import { AxiosError } from 'axios';

interface Props {
  patientId: number;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateEncounterModal = ({ patientId, patientName, onClose, onSuccess }: Props) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors,setDoctors] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<EncounterCreateRequest>({
    patientId: patientId,
    departmentId: 0,
    doctorId: 0, 
    encounterType: 'OPD',
    height: 0,
    weight: 0,
    temperature: 36.5,
    bloodPressure: '120/80',
    pulse: 80,
  });

  // Load danh sách khoa khi mở modal
  useEffect(() => {
    const loadData = async () => {
      try {
        const depts = await encounterService.getDepartments();
        setDepartments(depts);
        if (depts.length > 0) {
          setFormData(prev => ({ ...prev, departmentId: depts[0].id }));
        }
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
                // 1. Lỗi do Server trả về (VD: 400 Bad Request, 401 Unauthorized, 500 Internal Server Error)
                // Lúc này error.response CÓ dữ liệu
                if (error.response) {
                    // Lấy message từ Backend trả về (như bạn đã làm)
                    const message = error.response.data?.message || 'Lỗi !';
                    toast.error(message);
                } 
                // 2. Lỗi không nhận được phản hồi (Network Error, Server Down, CORS)
                // Lúc này error.request có, nhưng error.response thì KHÔNG
                else if (error.request) {
                    toast.error('Không thể kết nối đến Server. Vui lòng kiểm tra đường truyền!');
                } 
                // 3. Lỗi khi setup request (ít gặp)
                else {
                    toast.error('Lỗi!');
                }
            } else {
                // Lỗi logic code JS (VD: biến undefined...)
                toast.error('Đã xảy ra lỗi không xác định.');
            }
      }
    };
    loadData();
  }, []);
  useEffect(() => {
    const loadDoctors = async () => {
        if (formData.departmentId) {
            const docs = await encounterService.getDoctors(formData.departmentId);
            setDoctors(docs); 
        }
    };
    loadDoctors();
  }, [formData.departmentId]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate trước khi gọi API
    if(!validateForm(formData)){
        return;
    }

    setLoading(true);
    try {
        await encounterService.create(formData);
        toast.success(`Đã đăng ký khám cho BN ${patientName}`);
        onSuccess();
        onClose();
    } catch (error) {
        console.error("Lỗi chi tiết:", error);

        // --- BẮT ĐẦU ĐOẠN XỬ LÝ LỖI CHI TIẾT ---
        if (error instanceof AxiosError) {
            // 1. Lỗi từ Backend trả về (có response)
            if (error.response) {
                // Spring Boot thường trả về object lỗi dạng { status, error, message... }
                // Ta ưu tiên lấy field 'message'
                // Dấu ?. giúp tránh lỗi nếu data null
                const apiMessage = (error.response.data )?.message || 'Lỗi xử lý từ Server';
                toast.error(apiMessage);
            } 
            // 2. Lỗi mạng / Server không phản hồi (không có response)
            else if (error.request) {
                toast.error('Không thể kết nối Server (Network Error)');
            } 
            // 3. Lỗi khác
            else {
                toast.error('Lỗi không xác định khi gửi yêu cầu');
            }
        } else {
            // Lỗi Code JS (không phải lỗi API)
            toast.error('Đã xảy ra lỗi hệ thống (Client Error)');
        }
        // --- KẾT THÚC ---
        
    } finally {
        setLoading(false);
    }
  };
  // --- HÀM VALIDATE DỮ LIỆU ---
  const validateForm = (data: EncounterCreateRequest): boolean => {
    if (!data.departmentId || data.departmentId === 0) {
      toast.warning('Vui lòng chọn Khoa!');
      return false;
    }
    if (!data.doctorId || data.doctorId === 0) {
      toast.warning('Vui lòng chọn Bác sĩ!');
      return false;
    }

    if (data.height !== undefined && (data.height <= 0 || data.height >= 300)) {
        toast.warning('Chiều cao không hợp lý (0 - 300cm)!');
        return false;
    }

    if (data.weight !== undefined && (data.weight <= 0 || data.weight >= 500)) {
        toast.warning('Cân nặng không hợp lý!');
        return false;
    }

    if (data.temperature !== undefined) {
        if (data.temperature < 30 || data.temperature > 45) {
            toast.warning('Nhiệt độ cơ thể không hợp lý (30°C - 45°C)!');
            return false;
        }
    }

    if (data.pulse !== undefined && (data.pulse <= 0 || data.pulse >= 300)) {
        toast.warning('Chỉ số mạch không hợp lý!');
        return false;
    }

    if (data.bloodPressure && data.bloodPressure.trim() !== "") {
        const bpRegex = /^\d{2,3}\/\d{2,3}$/; 
        if (!bpRegex.test(data.bloodPressure)) {
            toast.warning('Huyết áp sai định dạng (Ví dụ đúng: 120/80)!');
            return false;
        }
        
        const [sys, dia] = data.bloodPressure.split('/').map(Number);
        if (sys <= dia) {
            toast.warning('Huyết áp tâm thu phải lớn hơn tâm trương!');
            return false;
        }
    }

    return true;
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2 text-primary-600">
            <Stethoscope size={24} />
            <h2 className="text-xl font-bold">Đăng ký khám bệnh</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          Đang tạo phiếu khám cho bệnh nhân: <span className="font-bold">{patientName}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hàng 1: Khoa & Bác sĩ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Khoa</label>
              <select 
                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.departmentId}
                onChange={(e) => setFormData({...formData, departmentId: Number(e.target.value)})}
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Bác sĩ</label>
              <select 
                className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.doctorId}
                onChange={(e) => setFormData({...formData, doctorId: Number(e.target.value)})}
              >
                 <option value={0}>-- Chọn bác sĩ --</option>
                 {/* Render bác sĩ giả lập */}
                 {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.fullName}</option>
                 ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />
          <p className="text-sm font-semibold text-gray-500">Thông tin sinh hiệu</p>

          {/* Hàng 2: Chiều cao & Cân nặng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Chiều cao (cm)</label>
              <input type="number" className="w-full rounded-lg border p-2.5" 
                value={formData.height} onChange={e => setFormData({...formData, height: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cân nặng (kg)</label>
              <input type="number" className="w-full rounded-lg border p-2.5"
                value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} />
            </div>
          </div>

          {/* Hàng 3: Mạch & Huyết áp & Nhiệt độ */}
          <div className="grid grid-cols-3 gap-3">
             <div>
              <label className="block text-sm font-medium text-gray-700">Mạch (lần/p)</label>
              <input type="number" className="w-full rounded-lg border p-2.5"
                value={formData.pulse} onChange={e => setFormData({...formData, pulse: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Huyết áp</label>
              <input type="text" className="w-full rounded-lg border p-2.5" placeholder="120/80"
                value={formData.bloodPressure} onChange={e => setFormData({...formData, bloodPressure: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nhiệt độ (°C)</label>
              <input type="number" step="0.1" className="w-full rounded-lg border p-2.5"
                value={formData.temperature} onChange={e => setFormData({...formData, temperature: Number(e.target.value)})} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">Hủy</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg">
              {loading ? 'Đang xử lý...' : 'Lưu phiếu khám'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default CreateEncounterModal;