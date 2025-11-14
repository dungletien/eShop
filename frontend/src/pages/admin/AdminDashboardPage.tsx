import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../shared/api';
import { Package, ShoppingCart, Users, ArrowRight, FolderTree } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    products: number;
    orders: number;
    users: number;
    categories: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products', { params: { pageSize: 1 } }).then((r) => r.data.total || 0),
      api.get('/orders').then((r) => (Array.isArray(r.data) ? r.data.length : 0)),
      api.get('/users').then((r) => (Array.isArray(r.data) ? r.data.length : 0)),
      api.get('/categories').then((r) => (Array.isArray(r.data) ? r.data.length : 0)),
    ])
      .then(([products, orders, users, categories]) =>
        setStats({ products, orders, users, categories })
      )
      .catch(() => setStats({ products: 0, orders: 0, users: 0, categories: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  const cards = [
    {
      title: 'Sản phẩm',
      value: stats?.products || 0,
      icon: Package,
      link: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      title: 'Danh mục',
      value: stats?.categories || 0,
      icon: FolderTree,
      link: '/admin/categories',
      color: 'bg-orange-500',
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
        <div className="grid grid-cols-3 gap-6">
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
                <h3 className="text-lg font-medium text-gray-600 mb-2">{card.title}</h3>
                <p className="text-4xl font-semibold">{card.value}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">Không thể tải dữ liệu</div>
      )}
    </div>
  );
}
