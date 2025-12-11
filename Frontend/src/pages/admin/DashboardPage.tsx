
import { useEffect, useState } from 'react';
import { 
    Users, DollarSign, Activity, Calendar,  FileText, FlaskConical 
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardStats, RevenueChartData } from '@/types/Dashboard';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<RevenueChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Gọi song song 2 API để tiết kiệm thời gian
            const [statsRes, chartRes] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getRevenueChart()
            ]);
            
            setStats(statsRes);
            setChartData(chartRes);
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải dữ liệu Dashboard');
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
          <div>
              <h1 className="text-2xl font-bold text-gray-800">Tổng quan bệnh viện</h1>
              <p className="text-gray-500 text-sm mt-1">Dữ liệu cập nhật theo thời gian thực</p>
          </div>
          <div className="text-right">
              <span className="bg-white border px-3 py-1 rounded-lg text-sm text-gray-600 font-medium shadow-sm">
                  {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
          </div>
      </div>

      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card: Lượt khám */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-gray-500 text-sm font-medium">Lượt khám hôm nay</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalPatientsToday}</h3>
                      <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">
                              {stats?.pendingEncounters} đang chờ
                          </span>
                      </div>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <Users size={24}/>
                  </div>
              </div>
          </div>

          {/* Card: Doanh thu */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-gray-500 text-sm font-medium">Doanh thu ngày</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">
                          {stats?.totalRevenueToday.toLocaleString()}
                      </h3>
                      <div className="text-xs text-gray-400 mt-1 flex flex-col">
                          <span>BHYT: {stats?.insuranceRevenueToday.toLocaleString()}</span>
                      </div>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <DollarSign size={24}/>
                  </div>
              </div>
          </div>

          {/* Card: Đơn thuốc */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-gray-500 text-sm font-medium">Đơn thuốc đã kê</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalPrescriptionsToday}</h3>
                      <span className="text-gray-400 text-xs mt-1 block">Trong hôm nay</span>
                  </div>
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                      <FileText size={24}/>
                  </div>
              </div>
          </div>

          {/* Card: Xét nghiệm */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-gray-500 text-sm font-medium">Chỉ định CLS</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalLabTestsToday}</h3>
                      <span className="text-gray-400 text-xs mt-1 block">Xét nghiệm & CĐHA</span>
                  </div>
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                      <FlaskConical size={24}/>
                  </div>
              </div>
          </div>
      </div>

      {/* 2. CHARTS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Biểu đồ doanh thu (Chiếm 2/3) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <Activity size={20} className="text-green-600"/> Biểu đồ doanh thu (7 ngày)
                  </h3>
              </div>
              
              <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                          <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#6B7280', fontSize: 12}} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#6B7280', fontSize: 12}}
                            tickFormatter={(value) => `${value / 1000000}M`} // Rút gọn số tiền (VD: 5M)
                          />
                          <Tooltip 
                            formatter={(value: number) => [value.toLocaleString() + ' VNĐ', 'Doanh thu']}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#10B981" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorRev)" 
                            activeDot={{r: 6, strokeWidth: 0}}
                          />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Hoạt động gần đây (Chiếm 1/3) - Có thể gọi thêm API AuditLog nếu muốn */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-600"/> Thông báo hệ thống
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {/* Mock data cho đẹp, sau này có thể thay bằng API Notification */}
                  <div className="flex gap-3 items-start pb-3 border-b border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <div>
                          <p className="text-sm text-gray-800">Hệ thống hoạt động bình thường.</p>
                          <p className="text-xs text-gray-400 mt-1">Vừa xong</p>
                      </div>
                  </div>
                  <div className="flex gap-3 items-start pb-3 border-b border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div>
                          <p className="text-sm text-gray-800">Đã sao lưu dữ liệu tự động.</p>
                          <p className="text-xs text-gray-400 mt-1">2 giờ trước</p>
                      </div>
                  </div>
                  <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                      <div>
                          <p className="text-sm text-gray-800">Cập nhật danh mục thuốc mới.</p>
                          <p className="text-xs text-gray-400 mt-1">Hôm qua</p>
                      </div>
                  </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <button className="text-sm text-blue-600 font-medium hover:underline">Xem tất cả hoạt động</button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardPage;