import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../shared/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    navigate('/');
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 360 }}>
      <h2>Đăng nhập</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      <input placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}


