import { useEffect, useState } from 'react';
import { api } from '../../shared/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{ products: number; orders: number; users: number } | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/products', { params: { pageSize: 1 } }).then((r) => r.data.total),
      api.get('/orders').then((r) => r.data.length),
      api.get('/users').then((r) => r.data.length)
    ])
      .then(([products, orders, users]) => setStats({ products, orders, users }))
      .catch(() => setStats({ products: 0, orders: 0, users: 0 }));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {stats ? (
        <ul>
          <li>Sản phẩm: {stats.products}</li>
          <li>Đơn hàng: {stats.orders}</li>
          <li>Người dùng: {stats.users}</li>
        </ul>
      ) : (
        <div>Đang tải...</div>
      )}
    </div>
  );
}


