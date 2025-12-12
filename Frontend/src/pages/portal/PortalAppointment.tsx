import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { appointmentService } from '@/services/appointmentService';
import type { PortalAppointment } from '@/types/Portal';

const PortalAppointments = () => {
  const [appointments, setAppointments] = useState<PortalAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Lấy tất cả về rồi filter ở client cho mượt, hoặc gọi API tùy nhu cầu
      const data = await appointmentService.getMyAppointments('all');
      setAppointments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return;
    try {
      await appointmentService.cancel(id);
      toast.success('Đã hủy lịch hẹn');
      loadData(); // Reload lại danh sách
    } catch (e) {
      toast.error('Không thể hủy lịch này');
      console.log(e);
    }
  };

  // Logic lọc Client-side
  const now = new Date();
  const filteredList = appointments.filter(appt => {
    const apptDate = new Date(appt.scheduledAt);
    const isFuture = apptDate > now;
    const isActive = appt.status === 'SCHEDULED';

    if (filter === 'upcoming') {
      // Sắp đến: Phải là tương lai VÀ chưa bị hủy/hoàn thành
      return isFuture && isActive;
    } else {
      // Lịch sử: Quá khứ HOẶC Đã hủy/Hoàn thành
      return !isFuture || !isActive;
    }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="text-blue-600"/> Lịch hẹn của tôi
           </h1>
           <p className="text-slate-500 text-sm">Quản lý các cuộc hẹn khám bệnh</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
          <button 
             onClick={() => setFilter('upcoming')}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                 filter === 'upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
             }`}
          >
             Sắp đến
          </button>
          <button 
             onClick={() => setFilter('history')}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                 filter === 'history' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
             }`}
          >
             Lịch sử / Đã hủy
          </button>
      </div>

      {/* List */}
      <div className="space-y-4">
         {loading ? (
            <div className="text-center py-10 text-slate-400">Đang tải dữ liệu...</div>
         ) : filteredList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <Calendar size={48} className="mx-auto text-slate-200 mb-3"/>
               <p className="text-slate-500">
                   {filter === 'upcoming' ? 'Bạn không có lịch hẹn nào sắp tới.' : 'Chưa có lịch sử đặt hẹn.'}
               </p>
            </div>
         ) : (
            filteredList.map((item) => {
               const date = new Date(item.scheduledAt);
               return (
                   <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center hover:border-blue-200 transition-colors">
                       
                       {/* Date Box */}
                       <div className={`flex flex-col items-center justify-center rounded-xl w-16 h-16 border flex-shrink-0 ${
                           filter === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                       }`}>
                           <span className="text-xs font-bold uppercase">Thg {date.getMonth() + 1}</span>
                           <span className="text-2xl font-bold">{date.getDate()}</span>
                       </div>

                       {/* Info */}
                       <div className="flex-1 space-y-1">
                           <div className="flex items-center gap-2 mb-1">
                               <Clock size={16} className={filter==='upcoming'?"text-blue-600":"text-slate-400"}/>
                               <span className="font-bold text-lg text-slate-800">
                                   {date.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                               </span>
                               {/* Badge Status */}
                               <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                                   item.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                                   item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                   'bg-red-100 text-red-700'
                               }`}>
                                   {item.status === 'SCHEDULED' ? 'Đang chờ' : 
                                    item.status === 'COMPLETED' ? 'Đã khám' : 'Đã hủy'}
                               </span>
                           </div>
                           
                           <div className="text-sm text-slate-600 space-y-1">
                               <div className="flex items-center gap-2">
                                   <MapPin size={14}/> Khoa: <span className="font-medium">{item.departmentName}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                   <User size={14}/> Bác sĩ: <span className="font-medium">{item.doctorName || 'Mặc định'}</span>
                               </div>
                           </div>
                           
                           {item.reason && (
                               <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded inline-block">
                                   Lý do: {item.reason}
                               </p>
                           )}
                       </div>

                       {/* Actions */}
                       <div className="md:ml-auto">
                           {item.status === 'SCHEDULED' && filter === 'upcoming' && (
                               <button 
                                   onClick={() => handleCancel(item.id)}
                                   className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition flex items-center gap-2"
                               >
                                   <XCircle size={16}/> Hủy lịch
                               </button>
                           )}
                           {item.status === 'COMPLETED' && (
                               <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                   <CheckCircle size={16}/> Đã hoàn thành
                               </div>
                           )}
                           {item.status === 'CANCELLED' && (
                               <div className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                                   <AlertCircle size={16}/> Đã hủy
                               </div>
                           )}
                       </div>
                   </div>
               );
            })
         )}
      </div>
    </div>
  );
};

export default PortalAppointments;