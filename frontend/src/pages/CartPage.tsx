import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../shared/api';

type CartItem = {
  id: number;
  quantity: number;
  product: { id: number; name: string; price: string };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get('/cart');
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  const updateQty = async (productId: number, quantity: number) => {
    await api.put(`/cart/${productId}`, { quantity });
    load();
  };

  const removeItem = async (productId: number) => {
    await api.delete(`/cart/${productId}`);
    load();
  };

  return (
    <div>
      <h2>Giỏ hàng</h2>
      <ul>
        {items.map((i) => (
          <li key={i.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ flex: 1 }}>{i.product.name}</span>
            <input
              type="number"
              value={i.quantity}
              min={1}
              onChange={(e) => updateQty(i.product.id, Number(e.target.value))}
              style={{ width: 60 }}
            />
            <span>{(Number(i.product.price) * i.quantity).toLocaleString('vi-VN')} ₫</span>
            <button onClick={() => removeItem(i.product.id)}>Xóa</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 12 }}>Tổng: {total.toLocaleString('vi-VN')} ₫</div>
      <button onClick={() => navigate('/checkout')} disabled={!items.length} style={{ marginTop: 8 }}>
        Thanh toán
      </button>
      <div style={{ marginTop: 12 }}>
        <Link to="/products">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );
}


