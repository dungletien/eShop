import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../shared/api';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/auth/register', { email, password, fullName });
    alert('Đăng ký thành công, vui lòng đăng nhập');
    navigate('/login');
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360 }}>
      <h2>Đăng ký</h2>
      <input placeholder="Họ tên" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      <input placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      <button type="submit">Tạo tài khoản</button>
    </form>
  );
}


