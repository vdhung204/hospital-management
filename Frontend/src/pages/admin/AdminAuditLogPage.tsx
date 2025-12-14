import { useEffect, useState } from 'react';
import { 
  Search, Filter, Clock, User, FileText, Activity, 
  Eye, X, ChevronLeft, ChevronRight, AlertCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { adminService, type AuditLog } from '@/services/adminService';

const AdminAuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterEntity, setFilterEntity] = useState('ALL');

  // State cho Modal chi tiết
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await adminService.getAuditLogs();
      setLogs(data);
    } catch (error) {
      toast.error('Không thể tải nhật ký hệ thống');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic Filter Client-side (cho đơn giản) ---
  const filteredLogs = logs.filter(log => {
    const matchSearch = 
      log.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId?.toString().includes(searchTerm);
    
    const matchAction = filterAction === 'ALL' || log.action === filterAction;
    const matchEntity = filterEntity === 'ALL' || log.entityName === filterEntity;

    return matchSearch && matchAction && matchEntity;
  });

  // --- Helper: Format Action Badge ---
  const getActionBadge = (action: string) => {
    const styles: Record<string, string> = {
      CREATE: 'bg-green-100 text-green-700 border-green-200',
      UPDATE: 'bg-blue-100 text-blue-700 border-blue-200',
      DELETE: 'bg-red-100 text-red-700 border-red-200',
      LOGIN: 'bg-purple-100 text-purple-700 border-purple-200',
      CANCEL: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    // Default style
    const style = styles[action] || 'bg-slate-100 text-slate-700 border-slate-200';
    
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-bold border ${style}`}>
        {action}
      </span>
    );
  };

  // --- Helper: Format Entity Icon ---
  const getEntityIcon = (entity: string) => {
    // Tùy chỉnh icon dựa theo tên bảng
    if (entity === 'Patient') return <User size={14} className="mr-1"/>;
    if (entity === 'Invoice') return <FileText size={14} className="mr-1"/>;
    return <Activity size={14} className="mr-1"/>;
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu nhật ký...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* 1. Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-teal-600" /> Nhật ký hệ thống
          </h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi các hoạt động quan trọng và bảo mật</p>
        </div>
        <button onClick={loadLogs} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
          Làm mới
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo User, ID đối tượng, hoặc nội dung..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Filter */}
        <div className="w-full md:w-48 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none appearance-none bg-white"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="ALL">Tất cả hành động</option>
            <option value="CREATE">CREATE (Tạo mới)</option>
            <option value="UPDATE">UPDATE (Cập nhật)</option>
            <option value="DELETE">DELETE (Xóa)</option>
            <option value="LOGIN">LOGIN (Đăng nhập)</option>
          </select>
        </div>

        {/* Entity Filter */}
        <div className="w-full md:w-48 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs border border-slate-300 rounded px-1">OBJ</div>
             <select 
              className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none appearance-none bg-white"
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
            >
              <option value="ALL">Tất cả đối tượng</option>
              <option value="Encounter">Encounter (Lượt khám)</option>
              <option value="Invoice">Invoice (Hóa đơn)</option>
              <option value="Patient">Patient (Bệnh nhân)</option>
              <option value="Drug">Drug (Thuốc)</option>
            </select>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-48">Thời gian</th>
                <th className="p-4 w-40">Người thực hiện</th>
                <th className="p-4 w-32">Hành động</th>
                <th className="p-4 w-40">Đối tượng</th>
                <th className="p-4">Chi tiết / Ghi chú</th>
                <th className="p-4 w-20 text-center">Xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                          {log.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{log.username}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-slate-700">
                         {getEntityIcon(log.entityName)}
                         <span className="font-medium">{log.entityName}</span>
                         <span className="ml-1 text-slate-400 text-xs">#{log.entityId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600 truncate max-w-xs" title={log.details}>
                        {log.details || <span className="italic text-slate-400">Không có ghi chú</span>}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-2 rounded-full hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={32} className="text-slate-300"/>
                        <p>Không tìm thấy nhật ký nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Giả lập UI) */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
           <span className="text-xs text-slate-500">Hiển thị {filteredLogs.length} kết quả</span>
           <div className="flex gap-2">
              <button disabled className="p-1 rounded bg-white border border-slate-200 text-slate-300 cursor-not-allowed"><ChevronLeft size={18}/></button>
              <button disabled className="p-1 rounded bg-white border border-slate-200 text-slate-300 cursor-not-allowed"><ChevronRight size={18}/></button>
           </div>
        </div>
      </div>

      {/* 4. MODAL DETAIL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    Chi tiết Nhật ký #{selectedLog.id}
                </h3>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Clock size={12}/> {new Date(selectedLog.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500"><X size={20}/></button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
               {/* Summary Grid */}
               <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div>
                      <span className="text-xs text-slate-400 uppercase font-bold">Người thực hiện</span>
                      <p className="font-medium text-slate-800 flex items-center gap-2 mt-1">
                          <User size={16} className="text-teal-600"/> {selectedLog.username}
                      </p>
                  </div>
                  <div>
                      <span className="text-xs text-slate-400 uppercase font-bold">Hành động</span>
                      <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                  </div>
                  <div>
                      <span className="text-xs text-slate-400 uppercase font-bold">Đối tượng</span>
                      <p className="font-medium text-slate-800 flex items-center gap-2 mt-1">
                          <FileText size={16} className="text-blue-600"/> {selectedLog.entityName} (ID: {selectedLog.entityId})
                      </p>
                  </div>
               </div>

               {/* Details Content */}
               <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Nội dung thay đổi / Ghi chú:</h4>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    {/* Nếu details trông giống JSON thì format, không thì hiển thị text thường */}
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-all">
                        {isJson(selectedLog.details) 
                            ? JSON.stringify(JSON.parse(selectedLog.details), null, 2) 
                            : selectedLog.details}
                    </pre>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                    onClick={() => setSelectedLog(null)}
                    className="px-5 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                >
                    Đóng
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Helper để check xem string có phải JSON không
function isJson(str: string) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export default AdminAuditLog;