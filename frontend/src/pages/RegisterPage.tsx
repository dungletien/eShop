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
    <div className="min-h-screen flex">
      {/* Left side - Image */}
            <div className="flex-1 bg-white flex justify-center items-center">
                <img
                    src="https://media.istockphoto.com/id/1281150061/vector/register-account-submit-access-login-password-username-internet-online-website-concept.jpg?s=612x612&w=0&k=20&c=9HWSuA9IaU4o-CK6fALBS5eaO1ubnsM08EOYwgbwGBo="
                    alt="background"
                    className="w-50 h-50 object-cover"
                />
            </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-8">
          <h2 className="text-3xl font-semibold mb-8 text-gray-900 text-center">
            Đăng ký
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Nhập họ tên của bạn"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Nhập email của bạn"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition duration-200"
            >
              Tạo tài khoản
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 transition"
            >
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
