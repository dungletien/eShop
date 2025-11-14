import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../shared/api';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { email, password, fullName });
      alert('Đăng ký thành công, vui lòng đăng nhập');
      navigate('/login');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-40 py-20">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Đăng ký</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Họ tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Tạo tài khoản
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-black font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
