import { useEffect, useState } from 'react';
//import { toast } from 'react-toastify';
import { Play, Clock, Activity, CheckCircle, Search, Heart } from 'lucide-react';
import { encounterService } from '../../services/encounterService';
import type { EncounterResponse } from '@/types/Encounter';
import { useNavigate } from 'react-router-dom';

const DoctorQueuePage = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<EncounterResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const currentDoctorId = user?.staffId;

  useEffect(() => {
    if(currentDoctorId){
      fetchQueue();
    }
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
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (encounterId: number) => {
    navigate(`/doctor/exam/${encounterId}`);
  };

  // Helper để lấy chữ cái đầu tên
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách chờ khám</h1>
          <p className="text-gray-500 text-sm mt-1">
            Bác sĩ: <span className="font-semibold text-teal-600">{user?.fullName}</span>
          </p>
        </div>
        
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
             <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Hàng đợi</p>
            <p className="font-bold text-gray-800 text-lg leading-none">{queue.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-800">Bệnh nhân đang chờ</h2>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm theo tên/mã..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-teal-500 w-64 outline-none transition-all"
              />
            </div>
            <button onClick={fetchQueue} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              Làm mới
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sinh hiệu</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <CheckCircle size={40} className="mb-2 opacity-50 text-gray-300" />
                      <p>Hiện không có bệnh nhân nào trong hàng chờ.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                queue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-teal-600 font-semibold text-sm">
                        #{String(item.queueNumber).padStart(3, '0')}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs mr-3 border border-gray-200">
                          {getInitials(item.patientName)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{item.patientName}</div>
                          <div className="text-xs text-gray-500">{item.patientCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5"> 
                        
                        <div className="flex items-center text-xs text-gray-600">
                          <Activity size={14} className="mr-1.5 text-orange-500" /> 
                          <span className="font-medium">{item.bloodPressure || '--/--'}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Heart size={14} className="mr-1.5 text-red-500" /> 
                          <span className="font-medium">
                            {item.pulse || '--'} 
                            <span className="text-[10px] text-gray-400 ml-1">l/p</span> 
                          </span>
                        </div>

                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        item.status === 'IN_PROGRESS' 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {item.status === 'IN_PROGRESS' ? 'Đang khám' : 'Đang chờ'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleStartExam(item.id)}
                        className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors shadow-sm border ${
                          item.status === 'IN_PROGRESS' 
                            ? 'bg-green-600 text-white border-green-600 hover:bg-green-700' 
                            : 'bg-white text-teal-600 border-gray-200 hover:bg-teal-50 hover:border-teal-200'
                        }`}
                        title={item.status === 'IN_PROGRESS' ? 'Tiếp tục khám' : 'Bắt đầu khám'}
                      >
                         <Play size={16} fill={item.status === 'IN_PROGRESS' ? "currentColor" : "none"} />
                         <span className="ml-2 text-xs font-medium hidden sm:inline-block">
                            {item.status === 'IN_PROGRESS' ? 'Tiếp tục' : 'Khám'}
                         </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {queue.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-500">Hiển thị {queue.length} kết quả</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 rounded border border-gray-200 bg-white text-xs text-gray-500 disabled:opacity-50" disabled>Trước</button>
                    <button className="px-3 py-1 rounded border border-gray-200 bg-teal-600 text-white text-xs font-medium">1</button>
                    <button className="px-3 py-1 rounded border border-gray-200 bg-white text-xs text-gray-500">Sau</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DoctorQueuePage;