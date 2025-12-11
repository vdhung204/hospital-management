import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, MapPin, ChevronRight, FileText, Search } from 'lucide-react';
import { encounterService } from '@/services/encounterService';

const PortalHistory = () => {
  const navigate = useNavigate();
  const [encounters, setEncounters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await encounterService.getHistory();
        setEncounters(data);
      } catch (error) {
        console.error("Lỗi tải lịch sử", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Lọc client-side (theo tên bác sĩ, khoa, hoặc chẩn đoán nếu có)
  const filteredList = encounters.filter(item => 
      item.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-teal-600"/> Lịch sử khám bệnh
           </h1>
           <p className="text-slate-500 text-sm">Toàn bộ hồ sơ sức khỏe của bạn</p>
        </div>
        
        {/* Search Box */}
        <div className="relative">
           <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
           <input 
              type="text" 
              placeholder="Tìm theo Bác sĩ, Khoa..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-64 text-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
         {loading ? (
            <div className="text-center py-10 text-slate-400">Đang tải dữ liệu...</div>
         ) : filteredList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <FileText size={48} className="mx-auto text-slate-200 mb-3"/>
               <p className="text-slate-500">Chưa có lịch sử khám bệnh nào.</p>
            </div>
         ) : (
            filteredList.map((item) => (
               <div 
                  key={item.id}
                  onClick={() => navigate(`/portal/history/${item.id}`)} // <--- CLICK ĐỂ VÀO CHI TIẾT
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group"
               >
                  <div className="flex justify-between items-start">
                     
                     {/* Left Info */}
                     <div className="flex gap-4">
                        {/* Date Box */}
                        <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-xl w-16 h-16 border border-blue-100 flex-shrink-0">
                           <span className="text-xs font-bold uppercase">Thg {new Date(item.visitDate).getMonth() + 1}</span>
                           <span className="text-2xl font-bold">{new Date(item.visitDate).getDate()}</span>
                           <span className="text-[10px]">{new Date(item.visitDate).getFullYear()}</span>
                        </div>

                        <div className="space-y-1">
                           {/* Status Badge */}
                           <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                 item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                 item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                 {item.status === 'COMPLETED' ? 'Hoàn thành' : item.status}
                              </span>
                              <span className="text-xs text-slate-400">#{item.id}</span>
                           </div>

                           <h3 className="font-bold text-lg text-slate-800 group-hover:text-teal-600 transition-colors">
                              {item.diagnosis || 'Khám bệnh tổng quát'} 
                              {/* Nếu DTO list chưa có diagnosis thì hiển thị placeholder */}
                           </h3>

                           <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              <span className="flex items-center gap-1"><MapPin size={14}/> {item.departmentName}</span>
                              <span className="flex items-center gap-1"><User size={14}/> BS. {item.doctorName}</span>
                           </div>
                        </div>
                     </div>

                     {/* Arrow Icon */}
                     <div className="self-center text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all">
                        <ChevronRight size={24}/>
                     </div>
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
};

export default PortalHistory;