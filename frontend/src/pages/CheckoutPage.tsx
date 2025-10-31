import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../shared/api';

export default function CheckoutPage() {
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/orders', { address });
    alert('Đặt hàng thành công');
    navigate('/orders');
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 480 }}>
      <h2>Thanh toán</h2>
      <label>Địa chỉ giao hàng</label>
      <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={4} required />
      <button type="submit" style={{ marginTop: 8 }}>Xác nhận</button>
    </form>
  );
}


