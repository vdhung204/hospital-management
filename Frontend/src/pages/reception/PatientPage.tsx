import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import type { Patient, PatientRequest } from '@/types/Patient';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

const PatientPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State cho Modal (Thêm/Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

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
      toast.error('Lỗi tải danh sách bệnh nhân');
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
        idNumber: patient.idNumber,
        address: patient.address,
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
    if(!validateForm(formData)){
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
  //Kiểm tra dữ liệu
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
    if (data.idNumber && !/^[0-9]{9,12}$/.test(data.idNumber)) {
        toast.warning('CCCD/CMND phải là số (9 hoặc 12 ký tự)!');
        return false;
    }
    return true;
  };
  
  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.patientCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bệnh nhân</h1>
          <p className="text-gray-500">Danh sách bệnh nhân đăng ký khám bệnh</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white shadow hover:bg-primary-700 transition"
        >
          <Plus size={20} />
          <span>Thêm bệnh nhân</span>
        </button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..." 
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- TABLE --- */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-sm font-semibold text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Mã BN</th>
              <th className="px-6 py-4">Họ và tên</th>
              <th className="px-6 py-4">Ngày sinh</th>
              <th className="px-6 py-4">Giới tính</th>
              <th className="px-6 py-4">SĐT</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center">Đang tải dữ liệu...</td></tr>
            ) : filteredPatients.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Không tìm thấy bệnh nhân nào.</td></tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary-600">{patient.patientCode}</td>
                  <td className="px-6 py-4 font-medium">{patient.fullName}</td>
                  <td className="px-6 py-4">{patient.dateOfBirth}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      patient.gender === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {
                      patient.gender === 'M' ? 'Nam' : 'Nữ'
                    }
                    </span>
                  </td>
                  <td className="px-6 py-4">{patient.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openModal(patient)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition"
                        title="Sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(patient.id)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                        title="Xóa"
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

      {/* --- MODAL (POPUP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPatient ? 'Cập nhật thông tin' : 'Thêm bệnh nhân mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
                    value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input required type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input required type="date" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
                    value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <select className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
                  <input type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
                    value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input type="text" className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none" 
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">Hủy bỏ</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-lg shadow-primary-500/30">
                  {editingPatient ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPage;