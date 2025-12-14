// import React, { useEffect, useState } from 'react';
// import { 
//   Building, Plus, Search, Edit3, Trash2, X, Save 
// } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { departmentService } from '@/services/departmentService';
// import type { Department, DepartmentRequest } from '@/types/Encounter';
// import { handleError } from '@/utils/errorHandler';

// const AdminDepartmentPage = () => {
//   // --- STATE ---
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [keyword, setKeyword] = useState('');

//   // State cho Modal (Thêm/Sửa)
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentId, setCurrentId] = useState<number | null>(null);
  
//   // Form Data
//   const [formData, setFormData] = useState<DepartmentRequest>({
//     code: '',
//     name: ''
//   });

//   // --- EFFECT ---
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await departmentService.getAll();
//       setDepartments(data);
//     } catch (error) {
//         handleError(error,'Lỗi tải danh sách khoa')
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- HANDLERS ---
  
//   // Mở modal thêm mới
//   const handleAddNew = () => {
//     setIsEditing(false);
//     setCurrentId(null);
//     setFormData({ code: '', name: '' });
//     setShowModal(true);
//   };

//   // Mở modal sửa
//   const handleEdit = (dept: Department) => {
//     setIsEditing(true);
//     setCurrentId(dept.id);
//     setFormData({ code: dept.code, name: dept.name });
//     setShowModal(true);
//   };

//   // Xử lý lưu (Create/Update)
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.code.trim() || !formData.name.trim()) {
//       toast.warning('Vui lòng nhập đầy đủ Mã và Tên khoa');
//       return;
//     }

//     try {
//       if (isEditing && currentId) {
//         await departmentService.update(currentId, formData);
//         toast.success('Cập nhật thành công!');
//       } else {
//         await departmentService.create(formData);
//         toast.success('Thêm mới thành công!');
//       }
//       setShowModal(false);
//       fetchData(); // Reload lại list
//     } catch (error) {
//         handleError(error,'Có lỗi xảy ra!')
//     }
//   };

//   // Xử lý xóa
//   const handleDelete = async (id: number) => {
//     if (!window.confirm('Bạn có chắc chắn muốn xóa khoa này?')) return;
//     try {
//       await departmentService.delete(id);
//       toast.success('Đã xóa khoa');
//       fetchData();
//     } catch (error) {
//       handleError(error,'Không thể xóa khoa (có thể do đang có nhân viên/dịch vụ liên kết)')
//     }
//   };

//   // Logic tìm kiếm (Client-side search)
//   const filteredDepartments = departments.filter(d => 
//     d.name.toLowerCase().includes(keyword.toLowerCase()) || 
//     d.code.toLowerCase().includes(keyword.toLowerCase())
//   );

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      
//       {/* 1. Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
//             <Building className="text-blue-600" /> Quản lý Khoa / Phòng
//           </h1>
//           <p className="text-slate-500 text-sm">Cấu hình danh mục các khoa trong bệnh viện</p>
//         </div>
//         <button 
//           onClick={handleAddNew}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
//         >
//           <Plus size={20} /> Thêm Khoa mới
//         </button>
//       </div>

//       {/* 2. Search Bar */}
//       <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//           <input 
//             type="text" 
//             placeholder="Tìm theo Mã khoa hoặc Tên khoa..." 
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* 3. Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
//             <tr>
//               <th className="p-4 w-20 text-center">ID</th>
//               <th className="p-4 w-40">Mã Khoa</th>
//               <th className="p-4">Tên Khoa</th>
//               <th className="p-4 w-32 text-center">Hành động</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {loading ? (
//               <tr><td colSpan={4} className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
//             ) : filteredDepartments.length === 0 ? (
//               <tr><td colSpan={4} className="p-8 text-center text-slate-400">Không tìm thấy dữ liệu.</td></tr>
//             ) : (
//               filteredDepartments.map((dept) => (
//                 <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
//                   <td className="p-4 text-center text-slate-500">{dept.id}</td>
//                   <td className="p-4 font-mono font-bold text-blue-700">{dept.code}</td>
//                   <td className="p-4 font-medium text-slate-800">{dept.name}</td>
//                   <td className="p-4 flex justify-center gap-2">
//                     <button 
//                       onClick={() => handleEdit(dept)}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       title="Chỉnh sửa"
//                     >
//                       <Edit3 size={18} />
//                     </button>
//                     <button 
//                       onClick={() => handleDelete(dept.id)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       title="Xóa"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 4. Modal Create/Edit */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            
//             {/* Modal Header */}
//             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
//               <h3 className="font-bold text-lg text-slate-800">
//                 {isEditing ? 'Cập nhật thông tin Khoa' : 'Thêm Khoa mới'}
//               </h3>
//               <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <form onSubmit={handleSave} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">Mã Khoa <span className="text-red-500">*</span></label>
//                 <input 
//                   type="text" 
//                   placeholder="Ví dụ: OPD, LAB, IMAGING..." 
//                   className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase font-mono"
//                   value={formData.code}
//                   onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
//                   required
//                 />
//                 <p className="text-xs text-slate-400 mt-1">Mã khoa viết tắt, viết hoa và không dấu.</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">Tên Khoa <span className="text-red-500">*</span></label>
//                 <input 
//                   type="text" 
//                   placeholder="Ví dụ: Khoa Khám bệnh..." 
//                   className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   required
//                 />
//               </div>

//               <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
//                 <button 
//                   type="button" 
//                   onClick={() => setShowModal(false)} 
//                   className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
//                 >
//                   Hủy bỏ
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg transition-colors flex items-center gap-2"
//                 >
//                   <Save size={18} /> {isEditing ? 'Lưu thay đổi' : 'Tạo mới'}
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminDepartmentPage;
import React, { useEffect, useState } from 'react';
import { 
  Building, Plus, Search, Edit3, Trash2, X, Save, RotateCcw 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { departmentService } from '@/services/departmentService';
import type { Department, DepartmentRequest } from '@/types/Encounter';
import { handleError } from '@/utils/errorHandler';

const AdminDepartmentPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  
  // State lọc hiển thị
  const [showDeleted, setShowDeleted] = useState(false); // Mặc định ẩn các khoa đã xóa

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DepartmentRequest>({ code: '', name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAllAdmin();
      setDepartments(data);
    } catch (error) {
        handleError(error,'Lỗi tải danh sách khoa');
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  
  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ code: '', name: '' });
    setShowModal(true);
  };

  const handleEdit = (dept: Department) => {
    setIsEditing(true);
    setCurrentId(dept.id);
    setFormData({ code: dept.code, name: dept.name });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await departmentService.update(currentId, formData);
        toast.success('Cập nhật thành công!');
      } else {
        await departmentService.create(formData);
        toast.success('Thêm mới thành công!');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      handleError(error,'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khoa này?')) return;
    try {
      await departmentService.delete(id);
      toast.success('Xóa thành công!');
      fetchData();
    } catch (error) {
      handleError(error,'Lỗi khi xóa khoa');
    }
  };

  // Handler Khôi phục
  const handleRestore = async (id: number) => {
    if (!window.confirm('Khôi phục khoa này hoạt động trở lại?')) return;
    try {
      await departmentService.restore(id);
      toast.success('Khôi phục thành công!');
      fetchData();
    } catch (error) {
      handleError(error,'Lỗi khi khôi phục');
    }
  };

  // Logic lọc dữ liệu hiển thị
  const filteredDepartments = departments.filter(d => {
    const matchesKeyword = d.name.toLowerCase().includes(keyword.toLowerCase()) || 
                           d.code.toLowerCase().includes(keyword.toLowerCase());
    
    // Nếu showDeleted = false thì chỉ hiện cái chưa xóa (deleted = false/null)
    // Nếu showDeleted = true thì hiện tất cả (hoặc chỉ hiện đã xóa tùy logic bạn muốn)
    // Ở đây tôi làm logic: showDeleted = true sẽ hiện cả danh sách bao gồm đã xóa
    const matchesStatus = showDeleted ? true : !d.isDelete;

    return matchesKeyword && matchesStatus;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building className="text-blue-600" /> Quản lý Khoa / Phòng
          </h1>
          <p className="text-slate-500 text-sm">Cấu hình danh mục các khoa trong bệnh viện</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          <Plus size={20} /> Thêm Khoa mới
        </button>
      </div>

      {/* 2. Toolbar (Search & Filter) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo Mã khoa hoặc Tên khoa..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* Toggle hiển thị đã xóa */}
        <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
                <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={showDeleted}
                    onChange={e => setShowDeleted(e.target.checked)}
                />
                Hiển thị khoa đã xóa
            </label>
        </div>
      </div>

      {/* 3. Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4 w-20 text-center">ID</th>
              <th className="p-4 w-32">Mã Khoa</th>
              <th className="p-4">Tên Khoa</th>
              {/* CỘT MỚI: TRẠNG THÁI */}
              <th className="p-4 w-32 text-center">Trạng thái</th>
              <th className="p-4 w-32 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
            ) : filteredDepartments.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Không tìm thấy dữ liệu.</td></tr>
            ) : (
              filteredDepartments.map((dept) => (
                <tr key={dept.id} className={`hover:bg-slate-50 transition-colors ${dept.isDelete ? 'bg-slate-50/50' : ''}`}>
                  <td className="p-4 text-center text-slate-500">{dept.id}</td>
                  <td className="p-4 font-mono font-bold text-blue-700">{dept.code}</td>
                  <td className={`p-4 font-medium ${dept.isDelete ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {dept.name}
                  </td>
                  
                  {/* HIỂN THỊ TRẠNG THÁI */}
                  <td className="p-4 text-center">
                      {dept.isDelete ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Đã xóa
                          </span>
                      ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Hoạt động
                          </span>
                      )}
                  </td>

                  <td className="p-4 flex justify-center gap-2">
                    {/* Logic nút bấm thay đổi theo trạng thái */}
                    {dept.isDelete ? (
                        <button 
                            onClick={() => handleRestore(dept.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Khôi phục"
                        >
                            <RotateCcw size={18} />
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={() => handleEdit(dept)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                            >
                                <Edit3 size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(dept.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Create/Edit (Giữ nguyên như cũ) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {isEditing ? 'Cập nhật thông tin Khoa' : 'Thêm Khoa mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã Khoa <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Ví dụ: OPD..." className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none uppercase font-mono"
                  value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên Khoa <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Ví dụ: Khoa Khám bệnh..." className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium">Hủy bỏ</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg flex items-center gap-2">
                  <Save size={18} /> {isEditing ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartmentPage;