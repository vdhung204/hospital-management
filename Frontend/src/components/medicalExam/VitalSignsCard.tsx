import React, { useState, useEffect } from 'react';
import { Activity, Edit2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { encounterService } from '@/services/encounterService'; // Đảm bảo import đúng

interface Props {
  encounterId: number;
  initialData: {
    height?: number;
    weight?: number;
    temperature?: number;
    pulse?: number;
    bloodPressure?: string;
  };
  onUpdate: () => void; // Hàm callback để reload lại dữ liệu cha nếu cần
}

const VitalSignsCard = ({ encounterId, initialData, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [vitals, setVitals] = useState(initialData);

  // Cập nhật state khi props thay đổi (lần đầu load)
  useEffect(() => {
    setVitals(initialData);
  }, [initialData]);

  // Tính BMI tự động
  const bmi = (vitals.height && vitals.weight) 
    ? (vitals.weight / ((vitals.height / 100) ** 2)).toFixed(1) 
    : '--';

  const handleSave = async () => {
    setLoading(true);
    try {
      // Gọi API update encounter (Cần đảm bảo backend có API PATCH hoặc PUT update thông tin này)
      await encounterService.updateVitals(encounterId, vitals);
      toast.success('Đã cập nhật sinh hiệu');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error('Lỗi cập nhật sinh hiệu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-slate-700 flex gap-2 items-center">
          <Activity size={18} className="text-red-500" /> Sinh hiệu
        </h4>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 size={16} />
          </button>
        ) : (
          <div className="flex gap-1">
            <button 
                onClick={() => { setIsEditing(false); setVitals(initialData); }} 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
                <X size={18} />
            </button>
            <button 
                onClick={handleSave} 
                disabled={loading}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
            >
                <Save size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Mạch */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-xs text-slate-500 block mb-1">Mạch (lần/p)</span>
          {isEditing ? (
            <input 
              type="number" className="w-full bg-white border border-slate-300 rounded px-1 py-0.5 font-bold text-slate-800 focus:outline-blue-500"
              value={vitals.pulse || ''}
              onChange={(e) => setVitals({...vitals, pulse: Number(e.target.value)})}
            />
          ) : (
            <span className="font-bold text-slate-800">{vitals.pulse || '--'}</span>
          )}
        </div>

        {/* Nhiệt độ */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-xs text-slate-500 block mb-1">Nhiệt độ (°C)</span>
          {isEditing ? (
            <input 
              type="number" step="0.1" className="w-full bg-white border border-slate-300 rounded px-1 py-0.5 font-bold text-slate-800 focus:outline-blue-500"
              value={vitals.temperature || ''}
              onChange={(e) => setVitals({...vitals, temperature: Number(e.target.value)})}
            />
          ) : (
            <span className={`font-bold ${Number(vitals.temperature) > 37.5 ? 'text-red-600' : 'text-slate-800'}`}>
              {vitals.temperature || '--'}
            </span>
          )}
        </div>

        {/* Huyết áp */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-xs text-slate-500 block mb-1">Huyết áp (mmHg)</span>
          {isEditing ? (
            <input 
              type="text" className="w-full bg-white border border-slate-300 rounded px-1 py-0.5 font-bold text-slate-800 focus:outline-blue-500"
              placeholder="120/80"
              value={vitals.bloodPressure || ''}
              onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
            />
          ) : (
            <span className="font-bold text-slate-800">{vitals.bloodPressure || '--'}</span>
          )}
        </div>

        {/* Nhịp thở (Nếu có, hoặc thay bằng SpO2) - Ở đây dùng BMI demo */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-xs text-slate-500 block mb-1">BMI</span>
          <span className="font-bold text-blue-600">{bmi}</span>
        </div>

        {/* Cân nặng */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-xs text-slate-500 block mb-1">Cân nặng (kg)</span>
          {isEditing ? (
            <input 
              type="number" step="0.1" className="w-full bg-white border border-slate-300 rounded px-1 py-0.5 font-bold text-slate-800 focus:outline-blue-500"
              value={vitals.weight || ''}
              onChange={(e) => setVitals({...vitals, weight: Number(e.target.value)})}
            />
          ) : (
            <span className="font-bold text-slate-800">{vitals.weight || '--'}</span>
          )}
        </div>

        {/* Chiều cao */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="text-xs text-slate-500 block mb-1">Chiều cao (cm)</span>
          {isEditing ? (
            <input 
              type="number" className="w-full bg-white border border-slate-300 rounded px-1 py-0.5 font-bold text-slate-800 focus:outline-blue-500"
              value={vitals.height || ''}
              onChange={(e) => setVitals({...vitals, height: Number(e.target.value)})}
            />
          ) : (
            <span className="font-bold text-slate-800">{vitals.height || '--'}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VitalSignsCard;