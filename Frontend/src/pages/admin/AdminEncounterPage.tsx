import { useEffect, useState } from 'react';
import { 
  Search, Filter, Calendar, Stethoscope, Eye, User 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { adminService, type EncounterDTO } from '@/services/adminService';
import { encounterService } from '@/services/encounterService'; // Giả sử đã có từ phần trước
import { handleError } from '@/utils/errorHandler';
import type { Department } from '@/types/Encounter';

const AdminEncounterPage = () => {
  const [encounters, setEncounters] = useState<EncounterDTO[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [deptId, setDeptId] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]); // Default today
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadDepartments();
    handleSearch();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await encounterService.getDepartments();
      setDepartments(data);
    } catch (e) { console.error(e); }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await adminService.searchEncounter({
        keyword,
        departmentId: deptId || null,
        status: status || null,
        fromDate,
        toDate
      });
      setEncounters(data);
    } catch (error) {
      handleError(error, 'Lỗi');
    } finally {
      setLoading(false);
    }
  };

//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Bạn có chắc muốn xóa lượt khám này? Dữ liệu liên quan có thể bị ảnh hưởng.')) return;
//     try {
//       await adminService.deleteEmcounter(id);
//       toast.success('Đã xóa lượt khám');
//       handleSearch(); // Refresh
//     } catch (error) {
//       handleError(error, 'Lỗi');
//     }
//   };

  // Helper badge
  const getStatusBadge = (st: string) => {
    const map: any = {
      'WAITING': 'bg-yellow-100 text-yellow-700',
      'IN_PROGRESS': 'bg-blue-100 text-blue-700',
      'COMPLETED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${map[st] || 'bg-gray-100 text-gray-600'}`}>
        {st}
      </span>
    );
  };

    const handleDetail = ()=>{
        toast.warn('Chức năng đang được phát triển');
    }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Stethoscope className="text-teal-600"/> Quản lý Lượt khám (Encounter)
        </h1>
        <p className="text-slate-500 text-sm">Theo dõi và quản lý toàn bộ hoạt động khám bệnh tại các khoa.</p>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Keyword */}
        <div className="md:col-span-2 relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
           <input 
              type="text" 
              placeholder="Tên BN, Mã BN..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 outline-none"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
           />
        </div>
        
        {/* Dates */}
        <div className="relative">
           <input 
              type="date" 
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 outline-none"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
           />
        </div>
        <div className="relative">
           <input 
              type="date" 
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 outline-none"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
           />
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
        >
          <Filter size={18}/> Lọc dữ liệu
        </button>
        
        {/* Row 2: Dept & Status */}
        <div className="md:col-span-2">
           <select 
             className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 outline-none bg-white"
             value={deptId}
             onChange={e => setDeptId(e.target.value)}
           >
             <option value="">-- Tất cả khoa --</option>
             {departments.map(d => (
               <option key={d.id} value={d.id}>{d.name}</option>
             ))}
           </select>
        </div>
        <div className="md:col-span-3">
           <select 
             className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 outline-none bg-white"
             value={status}
             onChange={e => setStatus(e.target.value)}
           >
             <option value="">-- Tất cả trạng thái --</option>
             <option value="WAITING">Chờ khám (WAITING)</option>
             <option value="IN_PROGRESS">Đang khám (IN_PROGRESS)</option>
             <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
             <option value="CANCELLED">Đã hủy (CANCELLED)</option>
           </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4">Ngày khám</th>
                <th className="p-4">STT</th>
                <th className="p-4">Bệnh nhân</th>
                <th className="p-4">Khoa / Bác sĩ</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 <tr><td colSpan={6} className="p-10 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
              ) : encounters.length === 0 ? (
                 <tr><td colSpan={6} className="p-10 text-center text-slate-400">Không tìm thấy lượt khám nào.</td></tr>
              ) : (
                encounters.map(enc => (
                  <tr key={enc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400"/>
                          {new Date(enc.visitDate).toLocaleString('vi-VN')}
                       </div>
                    </td>
                    <td className="p-4">
                       <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                         #{enc.queueNumber || '?'}
                       </span>
                    </td>
                    <td className="p-4">
                       <div>
                          <p className="font-bold text-slate-700 text-sm">{enc.patientName}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                             <User size={10}/> {enc.patientCode}
                          </p>
                       </div>
                    </td>
                    <td className="p-4">
                       <div className="text-sm">
                          <p className="text-slate-700">{enc.departmentName}</p>
                          <p className="text-xs text-slate-500 italic">
                             BS ID: {enc.doctorId || 'Chưa gán'}
                             {/* Nếu BE update trả về tên bác sĩ thì sửa chỗ này */}
                          </p>
                       </div>
                    </td>
                    <td className="p-4">
                       {getStatusBadge(enc.status)}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                       <button 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                          onClick={() => handleDetail()}
                       >
                          <Eye size={18}/>
                       </button>
                       {/* <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa / Hủy"
                          onClick={() => handleDelete(enc.id)}
                       >
                          <Trash2 size={18}/>
                       </button> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminEncounterPage;