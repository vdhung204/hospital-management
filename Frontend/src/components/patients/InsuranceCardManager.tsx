import React, { useEffect, useState } from 'react';
import { CreditCard, Plus, Trash2, Edit2, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { patientService } from '@/services/patientService'; // Nhớ import đúng
import { type InsuranceCard } from '@/types/Patient';

interface Props {
    patientId: number;
}

const InsuranceCardManager = ({ patientId }: Props) => {
    const [cards, setCards] = useState<InsuranceCard[]>([]);
    const [loading, setLoading] = useState(false);
    
    // State cho Modal
    const [showModal, setShowModal] = useState(false);
    const [editingCard, setEditingCard] = useState<InsuranceCard | null>(null);
    const [formData, setFormData] = useState({
        cardNumber: '',
        provider: 'BHYT Việt Nam',
        validFrom: '',
        validTo: '',
        coverageRate: 80,
        isPrimary: true
    });

    useEffect(() => {
        if (patientId) loadCards();
    }, [patientId]);

    const loadCards = async () => {
        setLoading(true);
        try {
            const data = await patientService.getInsuranceCards(patientId);
            setCards(data);
        } catch (e) { console.error(e); } 
        finally { setLoading(false); }
    };

    // Mở modal thêm mới
    const handleAddNew = () => {
        setEditingCard(null);
        setFormData({
            cardNumber: '', provider: 'BHYT Việt Nam',
            validFrom: new Date().toISOString().split('T')[0],
            validTo: '', coverageRate: 80, isPrimary: cards.length === 0
        });
        setShowModal(true);
    };

    // Mở modal sửa
    const handleEdit = (card: InsuranceCard) => {
        setEditingCard(card);
        setFormData({
            cardNumber: card.cardNumber,
            provider: card.provider,
            validFrom: card.validFrom,
            validTo: card.validTo,
            coverageRate: card.coverageRate,
            isPrimary: card.isPrimary
        });
        setShowModal(true);
    };

    // Xử lý Submit (Thêm/Sửa)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCard) {
                await patientService.updateInsuranceCard(patientId, editingCard.id, formData);
                toast.success('Cập nhật thẻ thành công');
            } else {
                await patientService.addInsuranceCard(patientId, formData);
                toast.success('Thêm thẻ mới thành công');
            }
            setShowModal(false);
            loadCards();
        } catch (error) {
            console.log(error);
            toast.error('Lỗi lưu thông tin thẻ');
        }
    };

    // Xử lý Xóa
    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa thẻ này?')) return;
        try {
            await patientService.deleteInsuranceCard(patientId, id);
            toast.success('Đã xóa thẻ');
            loadCards();
        } catch (e) 
        { 
            toast.error('Lỗi xóa thẻ');
            console.log(e);
        }
    };

    // Helper kiểm tra hết hạn
    const isExpired = (dateString: string) => new Date(dateString) < new Date();

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <CreditCard className="text-blue-600" size={20}/> Thẻ Bảo Hiểm
                </h3>
                <button onClick={handleAddNew} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-bold transition">
                    <Plus size={16}/> Thêm thẻ
                </button>
            </div>

            <div className="space-y-3">
                {loading ? <p className="text-gray-400 text-sm text-center">Đang tải...</p> : 
                 cards.length === 0 ? <p className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 rounded-lg">Chưa có thẻ bảo hiểm nào</p> :
                 cards.map(card => (
                    <div key={card.id} className={`p-4 rounded-xl border relative group transition-all ${
                        card.isPrimary ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-white'
                    }`}>
                        {/* Header thẻ */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-gray-800 text-lg tracking-wide">{card.cardNumber}</p>
                                <p className="text-xs text-gray-500 uppercase font-bold">{card.provider}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {card.isPrimary && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-blue-200">CHÍNH</span>}
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">{card.coverageRate}%</span>
                            </div>
                        </div>

                        {/* Thông tin hạn dùng */}
                        <div className="mt-3 flex items-center gap-4 text-sm">
                            <div className="text-gray-600">
                                <span className="text-xs text-gray-400 block">Hiệu lực từ</span>
                                {new Date(card.validFrom).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="text-gray-600">
                                <span className="text-xs text-gray-400 block">Đến ngày</span>
                                <span className={isExpired(card.validTo) ? 'text-red-600 font-bold flex items-center gap-1' : ''}>
                                    {new Date(card.validTo).toLocaleDateString('vi-VN')}
                                    {isExpired(card.validTo) && <AlertCircle size={12}/>}
                                </span>
                            </div>
                        </div>

                        {/* Actions (Hiện khi hover) */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button onClick={() => handleEdit(card)} className="p-1.5 bg-white border border-gray-200 rounded text-gray-500 hover:text-blue-600 hover:border-blue-300 shadow-sm">
                                <Edit2 size={14}/>
                            </button>
                            <button onClick={() => handleDelete(card.id)} className="p-1.5 bg-white border border-gray-200 rounded text-gray-500 hover:text-red-600 hover:border-red-300 shadow-sm">
                                <Trash2 size={14}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL FORM --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-lg font-bold text-gray-800">{editingCard ? 'Cập nhật thẻ' : 'Thêm thẻ mới'}</h3>
                            <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-gray-600"/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Số thẻ BHYT</label>
                                <input required type="text" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                                    value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value.toUpperCase()})} placeholder="VD: HS401..."/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mức hưởng (%)</label>
                                    <input required type="number" min="0" max="100" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.coverageRate} onChange={e => setFormData({...formData, coverageRate: Number(e.target.value)})}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Là thẻ chính?</label>
                                    <select className="w-full p-2.5 border rounded-lg bg-white outline-none"
                                        value={formData.isPrimary ? 'true' : 'false'} 
                                        onChange={e => setFormData({...formData, isPrimary: e.target.value === 'true'})}>
                                        <option value="true">Có</option>
                                        <option value="false">Không</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Từ ngày</label>
                                    <input required type="date" className="w-full p-2.5 border rounded-lg outline-none"
                                        value={formData.validFrom} onChange={e => setFormData({...formData, validFrom: e.target.value})}/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Đến ngày</label>
                                    <input required type="date" className="w-full p-2.5 border rounded-lg outline-none"
                                        value={formData.validTo} onChange={e => setFormData({...formData, validTo: e.target.value})}/>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2 shadow-lg transition-transform active:scale-95">
                                Lưu thông tin
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsuranceCardManager;