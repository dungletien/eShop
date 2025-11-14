import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../shared/api';
import { Trash2 } from 'lucide-react';

type CartItem = {
  id: number;
  quantity: number;
  product: { id: number; name: string; price: string };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  const updateQty = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    await api.put(`/cart/${productId}`, { quantity });
    loadCart();
  };

  const removeItem = async (productId: number) => {
    await api.delete(`/cart/${productId}`);
    loadCart();
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="container mx-auto px-40 py-10">
      <h1 className="text-4xl font-semibold mb-8">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link to="/products" className="text-black font-medium hover:underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-6"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2">{item.product.name}</h3>
                  <p className="text-xl font-semibold">
                    {Number(item.product.price).toLocaleString('vi-VN')} ₫
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <div className="text-right min-w-[120px]">
                  <p className="text-xl font-semibold mb-2">
                    {(Number(item.product.price) * item.quantity).toLocaleString('vi-VN')} ₫
                  </p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-4">Tổng kết</h2>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <span>Tạm tính:</span>
                <span>{total.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              Thanh toán
            </button>
            <Link
              to="/products"
              className="block text-center mt-4 text-gray-600 hover:text-black"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
