import { useEffect, useState } from 'react';
import { api } from '../shared/api';

type Order = {
  id: number;
  status: string;
  totalAmount: string;
  address: string;
  createdAt: string;
  items: Array<{
    product: { name: string };
    quantity: number;
    price: string;
  }>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/me')
      .then((res) => setOrders(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: 'Chờ xử lý',
      PAID: 'Đã thanh toán',
      SHIPPED: 'Đang giao hàng',
      COMPLETED: 'Hoàn thành',
      CANCELED: 'Đã hủy',
    };
    return texts[status] || status;
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="container mx-auto px-40 py-10">
      <h1 className="text-4xl font-semibold mb-8">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Bạn chưa có đơn hàng nào</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Đơn hàng #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-2xl font-semibold mt-2">
                    {Number(order.totalAmount).toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Địa chỉ:</strong> {order.address}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Sản phẩm:</p>
                  <ul className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        {item.product.name} x{item.quantity} - {Number(item.price).toLocaleString('vi-VN')} ₫
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
