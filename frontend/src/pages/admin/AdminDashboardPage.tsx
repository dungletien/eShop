import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../shared/api';
import { Package, ShoppingCart, Users, ArrowRight, FolderTree, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    products: number;
    orders: number;
    users: number;
    totalRevenue: number;
  } | null>(null);
  const [revenueData, setRevenueData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get('/products', { params: { pageSize: 1 } }),
          api.get('/orders'),
          api.get('/users'),
        ]);

        const products = productsRes.data.total || 0;
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const users = Array.isArray(usersRes.data) ? usersRes.data.length : 0;

        // Calculate total revenue (only from completed and paid orders)
        const completedOrders = orders.filter((order: any) => {
          return order.status === 'COMPLETED' || order.status === 'PAID';
        });
        
        const totalRevenue = completedOrders.reduce((sum: number, order: any) => {
          return sum + Number(order.totalAmount || 0);
        }, 0);

        setStats({ products, orders: orders.length, users, totalRevenue });

        // Generate revenue chart data (last 7 days, only completed orders)
        const last7Days = [];
        const revenueByDay = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          last7Days.push(date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }));

          // Calculate revenue for this day (only completed orders)
          const dayRevenue = completedOrders
            .filter((order: any) => {
              const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
              return orderDate === dateStr;
            })
            .reduce((sum: number, order: any) => {
              return sum + Number(order.totalAmount || 0);
            }, 0);

          revenueByDay.push(dayRevenue);
        }

        setRevenueData({ labels: last7Days, values: revenueByDay });
      } catch (error) {
        setStats({ products: 0, orders: 0, users: 0, totalRevenue: 0 });
        setRevenueData({ labels: [], values: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  // Revenue Chart Component
  const RevenueChart = () => {
    const maxValue = Math.max(...revenueData.values, 1);
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Doanh thu 7 ngày qua</h3>
        </div>
        
        <div className="h-64 flex items-end justify-between gap-2">
          {revenueData.labels.map((label, index) => {
            const height = revenueData.values[index] > 0 
              ? Math.max((revenueData.values[index] / maxValue) * 100, 5)
              : 5;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t flex flex-col justify-end relative group" style={{ height: '200px' }}>
                  <div 
                    className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t transition-all duration-300 hover:from-emerald-600 hover:to-emerald-500 relative"
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueData.values[index])}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">{label}</p>
              </div>
            );
          })}
        </div>
        
        {revenueData.values.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Chưa có dữ liệu doanh thu
          </div>
        )}
      </div>
    );
  };

  const cards = [
    {
      title: 'Tổng doanh thu',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0),
      icon: DollarSign,
      link: '/admin/orders',
      color: 'bg-emerald-500',
    },
    {
      title: 'Sản phẩm',
      value: stats?.products || 0,
      icon: Package,
      link: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Đơn hàng',
      value: stats?.orders || 0,
      icon: ShoppingCart,
      link: '/admin/orders',
      color: 'bg-green-500',
    },
    {
      title: 'Người dùng',
      value: stats?.users || 0,
      icon: Users,
      link: '/admin/users',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>
      {stats ? (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.link}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
                  <p className={`${card.title === 'Tổng doanh thu' ? 'text-2xl' : 'text-4xl'} font-semibold`}>
                    {card.value}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Revenue Chart */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <RevenueChart />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">Không thể tải dữ liệu</div>
      )}
    </div>
  );
}
