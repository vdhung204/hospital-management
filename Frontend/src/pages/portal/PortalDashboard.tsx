import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Activity, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient'; // Hoặc dùng service riêng

const PortalDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [lastEncounter, setLastEncounter] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
       const appts = await axiosClient.get('/portal/appointments');
       const history = await axiosClient.get('/portal/encounters');
       setAppointments(appts.data);
       setLastEncounter(history.data[0]); // Lấy cái mới nhất
    };
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Xin chào, chúc bạn ngày mới tốt lành!</h1>
        <p className="opacity-90">Theo dõi sức khỏe và lịch hẹn của bạn dễ dàng hơn bao giờ hết.</p>
        <button 
            onClick={() => navigate('/portal/booking')}
            className="mt-4 bg-white text-teal-600 px-6 py-2 rounded-full font-bold shadow hover:bg-teal-50 transition"
        >
            Đặt lịch khám ngay
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Lịch hẹn sắp tới */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Calendar className="text-blue-500"/> Lịch hẹn sắp tới
              </h3>
              <span className="text-xs text-blue-600 font-bold cursor-pointer" onClick={()=>navigate('/portal/booking')}>Xem tất cả</span>
           </div>
           
           {appointments.length > 0 ? (
              <div className="space-y-3">
                 {appointments.slice(0, 2).map((apt, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                       <div className="bg-white p-2 rounded-lg text-center min-w-[60px] shadow-sm">
                          <span className="block text-xs text-slate-500 font-bold">THG {new Date(apt.scheduledAt).getMonth()+1}</span>
                          <span className="block text-xl font-bold text-blue-600">{new Date(apt.scheduledAt).getDate()}</span>
                       </div>
                       <div>
                          <p className="font-bold text-slate-700">{new Date(apt.scheduledAt).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</p>
                          <p className="text-sm text-slate-500">{apt.departmentName} - BS. {apt.doctorName}</p>
                       </div>
                    </div>
                 ))}
              </div>
           ) : (
              <div className="text-center py-8 text-slate-400">
                 <Clock size={40} className="mx-auto mb-2 opacity-20"/>
                 <p className="text-sm">Bạn chưa có lịch hẹn nào.</p>
              </div>
           )}
        </div>

        {/* Card: Lần khám gần nhất */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Activity className="text-orange-500"/> Lần khám gần nhất
              </h3>
              <span className="text-xs text-teal-600 font-bold cursor-pointer" onClick={()=>navigate('/portal/history')}>Chi tiết</span>
           </div>

           {lastEncounter ? (
              <div className="relative">
                 <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                 <div className="relative pl-6 pb-4">
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow"></div>
                    <p className="text-sm font-bold text-slate-500">{new Date(lastEncounter.visitDate).toLocaleDateString('vi-VN')}</p>
                    <h4 className="font-bold text-lg text-slate-800 mt-1">{lastEncounter.diagnosis || 'Chưa có chẩn đoán'}</h4>
                    <p className="text-sm text-slate-600">{lastEncounter.departmentName}</p>
                    
                    <div className="mt-3 flex gap-2">
                       <button className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1">
                          <FileText size={12}/> Đơn thuốc
                       </button>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="text-center py-8 text-slate-400">
                 <FileText size={40} className="mx-auto mb-2 opacity-20"/>
                 <p className="text-sm">Chưa có lịch sử khám bệnh.</p>
              </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default PortalDashboard;