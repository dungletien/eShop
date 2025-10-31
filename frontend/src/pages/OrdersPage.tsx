import { useEffect, useState } from 'react';
import { api } from '../shared/api';

type Order = {
  id: number;
  status: string;
  totalAmount: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.get('/orders/me').then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>Đơn hàng của tôi</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id} style={{ display: 'flex', gap: 12 }}>
            <span>#{o.id}</span>
            <span>{o.status}</span>
            <span>{Number(o.totalAmount).toLocaleString('vi-VN')} ₫</span>
            <span>{new Date(o.createdAt).toLocaleString('vi-VN')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


