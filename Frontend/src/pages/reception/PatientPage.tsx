// import React, { useEffect, useState } from 'react';
// import { patientService } from '../../services/patientService';
// import type { Patient, PatientRequest } from '@/types/Patient';
// import { Plus, Search, Edit2, Trash2, X, Stethoscope } from 'lucide-react';
// import { toast } from 'react-toastify';
// import CreateEncounterModal from '@/components/reception/CreateEncounterModel';
// import { AxiosError } from 'axios';

// const PatientPage = () => {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   // State cho Modal 
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
//   // State cho Modal Đăng ký khám
//   const [selectedPatientForExam, setSelectedPatientForExam] = useState<Patient | null>(null);

//   // Form Data
//   const [formData, setFormData] = useState<PatientRequest>({
//     fullName: '',
//     dateOfBirth: '',
//     gender: 'M',
//     phone: '',
//     idNumber: '',
//     address: '',
//   });

//   // 1. Load dữ liệu khi vào trang
//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     setLoading(true);
//     try {
//       const data = await patientService.getAll();
//       setPatients(data);
//     } catch (error) {
//         console.log(error)
//       if (error instanceof AxiosError) {
//             if (error.response) {
//                 const apiMessage = error.response.data?.message || 'Lỗi xử lý từ Server';
//                 toast.error(apiMessage);
//             } 
//             else if (error.request) {
//                 toast.error('Không thể kết nối Server (Network Error)');
//             } 
//             else {
//                 toast.error('Lỗi không xác định khi gửi yêu cầu');
//             }
//         } else {
//             toast.error('Đã xảy ra lỗi hệ thống (Client Error)');
//         }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Xử lý mở Modal
//   const openModal = (patient?: Patient) => {
//     if (patient) {
//       setEditingPatient(patient);
//       setFormData({
//         fullName: patient.fullName,
//         dateOfBirth: patient.dateOfBirth,
//         gender: patient.gender,
//         phone: patient.phone,
//         idNumber: patient.idNumber,
//         address: patient.address,
//       });
//     } else {
//       setEditingPatient(null);
//       setFormData({ fullName: '', dateOfBirth: '', gender: 'M', phone: '', idNumber: '', address: '' });
//     }
//     setIsModalOpen(true);
//   };

//   // 3. Xử lý Lưu (Thêm mới hoặc Update)
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if(!validateForm(formData)){
//       return;
//     }
//     try {
//       if (editingPatient) {
//         await patientService.update(editingPatient.id, formData);
//         toast.success('Cập nhật thành công!');
//       } else {
//         await patientService.create(formData);
//         toast.success('Thêm mới thành công!');
//       }
//       setIsModalOpen(false);
//       fetchPatients(); // Tải lại danh sách
//     } catch (error) {
//         console.log(error);
//       toast.error('Có lỗi xảy ra!');
//     }
//   };

//   // 4. Xử lý Xóa
//   const handleDelete = async (id: number) => {
//     if (window.confirm('Bạn có chắc muốn xóa bệnh nhân này?')) {
//       try {
//         await patientService.delete(id);
//         toast.success('Đã xóa bệnh nhân');
//         fetchPatients();
//       } catch (error) {
//         console.log(error);
//         toast.error('Không thể xóa');
//       }
//     }
//   };
//   //Kiểm tra dữ liệu
//   const validateForm = (data: PatientRequest): boolean => {
//     if (!data.fullName.trim()) {
//       toast.warning('Vui lòng nhập đầy đủ họ tên!');
//       return false;
//     }
//     if (!/^[0-9]{10}$/.test(data.phone)) {
//       toast.warning('Số điện thoại không hợp lệ (phải là 10 chữ số)!');
//       return false;
//     }
//     if (!data.dateOfBirth) {
//       toast.warning('Vui lòng chọn ngày sinh!');
//       return false;
//     }
//     const dob = new Date(data.dateOfBirth);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); 
    
//     if (dob >= today) {
//       toast.warning('Ngày sinh phải nhỏ hơn ngày hiện tại!');
//       return false;
//     }
//     if (data.idNumber && !/^[0-9]{9,12}$/.test(data.idNumber)) {
//         toast.warning('CCCD/CMND phải là số (9 hoặc 12 ký tự)!');
//         return false;
//     }
//     return true;
//   };

//   // Lọc danh sách theo từ khóa tìm kiếm
//   const filteredPatients = patients.filter(p => 
//     p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     p.patientCode.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Quản lý bệnh nhân</h1>
//           <p className="text-gray-500">Danh sách bệnh nhân đăng ký khám bệnh</p>
//         </div>
//         <button 
//           onClick={() => openModal()}
//           className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white shadow hover:bg-primary-700 transition"
//         >
//           <Plus size={20} />
//           <span>Thêm bệnh nhân</span>
//         </button>
//       </div>

//       {/* --- SEARCH BAR --- */}
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//         <input 
//           type="text" 
//           placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..." 
//           className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* --- TABLE --- */}
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-gray-50 text-sm font-semibold text-gray-600 uppercase tracking-wider">
//             <tr>
//               <th className="px-6 py-4">Mã BN</th>
//               <th className="px-6 py-4">Họ và tên</th>
//               <th className="px-6 py-4">Ngày sinh</th>
//               <th className="px-6 py-4">Giới tính</th>
//               <th className="px-6 py-4">SĐT</th>
//               <th className="px-6 py-4 text-right">Thao tác</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
//             {loading ? (
//               <tr><td colSpan={6} className="px-6 py-8 text-center">Đang tải dữ liệu...</td></tr>
//             ) : filteredPatients.length === 0 ? (
//               <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Không tìm thấy bệnh nhân nào.</td></tr>
//             ) : (
//               filteredPatients.map((patient) => (
//                 <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 font-medium text-primary-600">{patient.patientCode}</td>
//                   <td className="px-6 py-4 font-medium">{patient.fullName}</td>
//                   <td className="px-6 py-4">{patient.dateOfBirth}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       patient.gender === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
//                     }`}>
//                       {
//                       patient.gender === 'M' ? 'Nam' : 'Nữ'
//                     }
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">{patient.phone}</td>
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex justify-end gap-2">
//                       <button 
//                         onClick={() => setSelectedPatientForExam(patient)}
//                         className="p-2 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-600 transition"
//                         title="Đăng ký khám" >
//                         <Stethoscope size={18} />
//                       </button>
//                       <button 
//                         onClick={() => openModal(patient)}
//                         className="p-2 rounded-lg text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition"
//                         title="Sửa"
//                       >
//                         <Edit2 size={18} />
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(patient.id)}
//                         className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
//                         title="Xóa"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* --- MODAL (POPUP) --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
//           <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-slide-up">
//             <div className="flex items-center justify-between border-b pb-4 mb-6">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {editingPatient ? 'Cập nhật thông tin' : 'Thêm bệnh nhân mới'}
//               </h2>
//               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
//                 <X size={24} />
//               </button>
//             </div>

//             <form onSubmit={handleSave} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
//                   <input required type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
//                     value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
//                   <input required type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
//                     value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
//                   <input required type="date" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
//                     value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
//                   <select className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
//                     value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
//                     <option value="M">Nam</option>
//                     <option value="F">Nữ</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
//                   <input type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
//                     value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
//                   <input type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
//                     value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
//                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">Hủy bỏ</button>
//                 <button type="submit" className="px-5 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30">
//                   {editingPatient ? 'Cập nhật' : 'Thêm mới'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//         {/* --- MODAL ĐĂNG KÝ KHÁM --- */}
//         {selectedPatientForExam && (
//           <CreateEncounterModal
//             patientId={selectedPatientForExam.id}
//             patientName={selectedPatientForExam.fullName}
//             onClose={() => setSelectedPatientForExam(null)}
//             onSuccess={() => {
//                 // Có thể navigate sang trang khác hoặc chỉ cần thông báo
//                 toast.info('Đã chuyển bệnh nhân vào hàng đợi.');
//             }}
//           />
//         )}
//     </div>
//   );
// };

// export default PatientPage;
import React, { useEffect, useState } from 'react';
// Sửa đường dẫn import thành tương đối để tránh lỗi alias '@'
import { patientService } from '../../services/patientService';
import type { Patient, PatientRequest } from '../../types/Patient';
import CreateEncounterModal from '../../components/reception/CreateEncounterModel';
import { Plus, Search, Edit2, Trash2, X, Stethoscope, Users, Activity, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const PatientPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State cho Modal 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  // State cho Modal Đăng ký khám
  const [selectedPatientForExam, setSelectedPatientForExam] = useState<Patient | null>(null);

  // Form Data
  const [formData, setFormData] = useState<PatientRequest>({
    fullName: '',
    dateOfBirth: '',
    gender: 'M',
    phone: '',
    idNumber: '',
    address: '',
  });

  // 1. Load dữ liệu khi vào trang
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        if (error.response) {
          const apiMessage = error.response.data?.message || 'Lỗi xử lý từ Server';
          toast.error(apiMessage);
        }
        else if (error.request) {
          toast.error('Không thể kết nối Server (Network Error)');
        }
        else {
          toast.error('Lỗi không xác định khi gửi yêu cầu');
        }
      } else {
        // Trong môi trường preview, lỗi có thể xảy ra do service mock, nên toast nhẹ nhàng hơn
        console.error('System Error:', error); 
        // toast.error('Đã xảy ra lỗi hệ thống'); 
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý mở Modal
  const openModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        phone: patient.phone,
        idNumber: patient.idNumber || '',
        address: patient.address || '',
      });
    } else {
      setEditingPatient(null);
      setFormData({ fullName: '', dateOfBirth: '', gender: 'M', phone: '', idNumber: '', address: '' });
    }
    setIsModalOpen(true);
  };

  // 3. Xử lý Lưu (Thêm mới hoặc Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData)) {
      return;
    }
    try {
      if (editingPatient) {
        await patientService.update(editingPatient.id, formData);
        toast.success('Cập nhật thành công!');
      } else {
        await patientService.create(formData);
        toast.success('Thêm mới thành công!');
      }
      setIsModalOpen(false);
      fetchPatients(); // Tải lại danh sách
    } catch (error) {
      console.log(error);
      toast.error('Có lỗi xảy ra!');
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa bệnh nhân này?')) {
      try {
        await patientService.delete(id);
        toast.success('Đã xóa bệnh nhân');
        fetchPatients();
      } catch (error) {
        console.log(error);
        toast.error('Không thể xóa');
      }
    }
  };

  // Kiểm tra dữ liệu
  const validateForm = (data: PatientRequest): boolean => {
    if (!data.fullName.trim()) {
      toast.warning('Vui lòng nhập đầy đủ họ tên!');
      return false;
    }
    if (!/^[0-9]{10}$/.test(data.phone)) {
      toast.warning('Số điện thoại không hợp lệ (phải là 10 chữ số)!');
      return false;
    }
    if (!data.dateOfBirth) {
      toast.warning('Vui lòng chọn ngày sinh!');
      return false;
    }
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dob >= today) {
      toast.warning('Ngày sinh phải nhỏ hơn ngày hiện tại!');
      return false;
    }
    return true;
  };

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans animate-fade-in p-4 bg-slate-50 min-h-screen">
      
      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:-translate-y-1">
            <div>
               <p className="text-sm font-medium text-slate-500">Tổng bệnh nhân</p>
               <h3 className="text-2xl font-bold text-slate-800">{patients.length}</h3>
            </div>
            <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
               <Users size={24} />
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:-translate-y-1">
            <div>
               <p className="text-sm font-medium text-slate-500">Bệnh nhân mới (Tháng)</p>
               <h3 className="text-2xl font-bold text-slate-800">
                  {patients.length > 0 ? patients.length : 0}
               </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
               <Activity size={24} />
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-transform hover:-translate-y-1">
            <div>
               <p className="text-sm font-medium text-slate-500">Hàng đợi khám</p>
               <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
               <Calendar size={24} />
            </div>
         </div>
      </div>

      {/* --- HEADER & ACTIONS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý bệnh nhân</h1>
          <p className="text-slate-500 text-sm">Danh sách hồ sơ bệnh nhân</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           {/* Search Input */}
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Tìm theo tên/mã..." 
               className="pl-10 pr-4 py-2.5 w-64 rounded-lg border border-slate-200 bg-white text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all shadow-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>

           {/* Button Thêm mới */}
           <button 
             onClick={() => openModal()}
             className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-2.5 text-white font-medium shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all"
           >
             <Plus size={20} />
             <span>Thêm mới</span>
           </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã BN</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Họ và tên</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày sinh</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giới tính</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SĐT</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : filteredPatients.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">Không tìm thấy bệnh nhân nào.</td></tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-sm font-semibold text-teal-600">
                       {patient.patientCode}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 uppercase">
                             {patient.fullName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{patient.fullName}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{patient.dateOfBirth}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        patient.gender === 'M' 
                           ? 'bg-blue-50 text-blue-700 border-blue-100' 
                           : 'bg-pink-50 text-pink-700 border-pink-100'
                      }`}>
                        {patient.gender === 'M' ? 'Nam' : 'Nữ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{patient.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                           onClick={() => setSelectedPatientForExam(patient)}
                           className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                           title="Đăng ký khám"
                        >
                           <Stethoscope size={18} />
                        </button>
                        <button 
                           onClick={() => openModal(patient)}
                           className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                           title="Sửa thông tin"
                        >
                           <Edit2 size={18} />
                        </button>
                        <button 
                           onClick={() => handleDelete(patient.id)}
                           className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                           title="Xóa hồ sơ"
                        >
                           <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
           <span className="text-sm text-slate-500">Hiển thị {filteredPatients.length} kết quả</span>
        </div>
      </div>

      {/* --- MODAL (POPUP Form) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-slide-up border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingPatient ? 'Cập nhật thông tin' : 'Thêm hồ sơ mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" 
                    value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xxx..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày sinh</label>
                  <input required type="date" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" 
                    value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giới tính</label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-white"
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">CCCD/CMND</label>
                  <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" 
                    value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa chỉ</label>
                  <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all" 
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-medium shadow-lg shadow-teal-500/30 text-sm transition-all">
                  {editingPatient ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL ĐĂNG KÝ KHÁM --- */}
      {selectedPatientForExam && (
        <CreateEncounterModal
          patientId={selectedPatientForExam.id}
          patientName={selectedPatientForExam.fullName}
          onClose={() => setSelectedPatientForExam(null)}
          onSuccess={() => {
            toast.info('Đã chuyển bệnh nhân vào hàng đợi.');
          }}
        />
      )}
    </div>
  );
};

export default PatientPage;