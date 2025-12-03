import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Play, Clock, Activity, CheckCircle } from 'lucide-react';
import { encounterService } from '../../services/encounterService';
import type { EncounterResponse } from '@/types/Encounter';

const DoctorQueuePage = () => {
  const [queue, setQueue] = useState<EncounterResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy ID bác sĩ đang đăng nhập (từ localStorage)
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Lưu ý: User login là Account, cần map sang Staff ID (Doctor ID). 
  // Trong thực tế API login nên trả về cả staffId. 
  // Nếu chưa có, ta tạm dùng userId hoặc bạn cần sửa Backend LoginResponse trả thêm staffId.
  // GIẢ ĐỊNH: LoginResponse đã có field `userId` và ta dùng nó mapping tạm (hoặc fix cứng để test).
  // ĐỂ TEST NHANH: Bạn hãy xem lại bảng Staff trong DB, xem user `doctor1` ứng với Staff ID mấy.
  const currentDoctorId = 1; // !!! TODO: Lấy động từ user context (ví dụ user.staffId)

  useEffect(() => {
    fetchQueue();
    
    // Auto refresh mỗi 30s để cập nhật danh sách mới
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    if (!currentDoctorId) return;
    setLoading(true);
    try {
      const data = await encounterService.getDoctorQueue(currentDoctorId);
      setQueue(data);
    } catch (error) {
      console.error(error);
      // Không toast lỗi ở đây để tránh spam khi auto refresh
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (encounterId: number) => {
    // 1. Chuyển hướng sang trang khám chi tiết
    // navigate(`/doctor/exam/${encounterId}`);
    toast.info(`Bắt đầu khám ca #${encounterId} (Tính năng đang phát triển)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách chờ khám</h1>
          <p className="text-gray-500">Bác sĩ: <span className="font-semibold text-primary-600">{user?.fullName}</span></p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-blue-700">
          <Clock size={20} />
          <span className="font-medium">Đang chờ: {queue.length} bệnh nhân</span>
        </div>
      </div>

      {/* Grid View thay vì Table nhìn cho hiện đại */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && queue.length === 0 ? (
          <p>Đang tải...</p>
        ) : queue.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
            <CheckCircle size={48} className="mb-2 opacity-50" />
            <p>Hiện không có bệnh nhân nào trong hàng chờ.</p>
          </div>
        ) : (
          queue.map((item) => (
            <div 
              key={item.id} 
              className={`relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                item.status === 'IN_PROGRESS' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'
              }`}
            >
              {/* Status Badge */}
              <div className={`absolute right-0 top-0 rounded-bl-xl px-3 py-1 text-xs font-bold text-white ${
                item.status === 'IN_PROGRESS' ? 'bg-green-500' : 'bg-primary-500'
              }`}>
                {item.status === 'IN_PROGRESS' ? 'ĐANG KHÁM' : 'ĐANG CHỜ'}
              </div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Số thứ tự</span>
                  <div className="text-3xl font-bold text-gray-800">{String(item.queueNumber).padStart(3, '0')}</div>
                </div>
                {/* Sinh hiệu nhanh */}
                <div className="text-right text-xs text-gray-500 space-y-1">
                   <div className="flex items-center justify-end gap-1">
                      <Activity size={14} className="text-red-500" /> 
                      <span>HA: {item.bloodPressure || '--'}</span>
                   </div>
                   <div>Mạch: {item.pulse || '--'} l/p</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-primary-700 truncate">{item.patientName}</h3>
                <p className="text-sm text-gray-500">{item.patientCode}</p>
              </div>

              <button 
                onClick={() => handleStartExam(item.id)}
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-semibold text-white transition-colors ${
                    item.status === 'IN_PROGRESS' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                <Play size={18} fill="currentColor" />
                {item.status === 'IN_PROGRESS' ? 'Tiếp tục khám' : 'Bắt đầu khám'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorQueuePage;