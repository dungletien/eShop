import { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import { User, Shield } from 'lucide-react';

type UserData = {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      alert('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Quản lý Người dùng</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Vai trò</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{user.id}</td>
                <td className="px-6 py-4 text-sm font-medium">{user.fullName}</td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role === 'ADMIN' ? (
                      <Shield className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tổng số người dùng:</strong> {users.length}
        </p>
        <p className="text-sm text-blue-800 mt-1">
          <strong>Quản trị viên:</strong>{' '}
          {users.filter((u) => u.role === 'ADMIN').length}
        </p>
        <p className="text-sm text-blue-800 mt-1">
          <strong>Khách hàng:</strong>{' '}
          {users.filter((u) => u.role === 'CUSTOMER').length}
        </p>
      </div>
    </div>
  );
}



