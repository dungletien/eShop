import { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import { Eye, Package, Truck, CheckCircle, XCircle, Info, X } from 'lucide-react';

type Order = {
  id: number;
  status: string;
  totalAmount: string;
  address: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
  items: {
    id: number;
    quantity: number;
    price: string;
    product: {
      name: string;
      colors?: any;
    };
  }[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Function để xử lý màu sắc từ sản phẩm
  const getProductColors = (product: any): string[] => {
    if (product?.colors) {
      if (Array.isArray(product.colors) && product.colors.length > 0) {
        return product.colors;
      } else if (typeof product.colors === "string") {
        try {
          const parsedColors = JSON.parse(product.colors);
          if (Array.isArray(parsedColors) && parsedColors.length > 0) {
            return parsedColors;
          }
        } catch {
          return [product.colors];
        }
      }
    }
    return [];
  };

  // Lấy tên màu từ hex code
  const getColorName = (colorHex: string): string => {
    const colorMap: { [key: string]: string } = {
      "#000000": "Đen",
      "#FFFFFF": "Trắng", 
      "#FF0000": "Đỏ",
      "#0000FF": "Xanh dương",
      "#00FF00": "Xanh lá",
      "#FFFF00": "Vàng",
      "#FFA500": "Cam",
      "#800080": "Tím",
      "#FFC0CB": "Hồng",
      "#808080": "Xám",
      "#A52A2A": "Nâu",
      "#000080": "Xanh navy",
    };
    return colorMap[colorHex.toUpperCase()] || colorHex;
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      alert('Lỗi khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      alert('Cập nhật trạng thái thành công');
      loadOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'PAID': return 'text-blue-600 bg-blue-100';
      case 'SHIPPED': return 'text-purple-600 bg-purple-100';
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'CANCELED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Package className="w-4 h-4" />;
      case 'PAID': return <CheckCircle className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELED': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PAID': return 'Đã thanh toán';
      case 'SHIPPED': return 'Đang giao';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELED': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Tiền mặt';
      case 'transfer': return 'Chuyển khoản';
      default: return method || 'Chưa xác định';
    }
  };

  const showOrderDetail = (order: Order) => {
    try {
      console.log('Showing order detail for:', order);
      if (!order) {
        console.error('Order is null or undefined');
        return;
      }
      setSelectedOrder(order);
      setShowModal(true);
    } catch (error) {
      console.error('Error in showOrderDetail:', error);
      alert('Có lỗi khi hiển thị chi tiết đơn hàng');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  // Debug log
  console.log('AdminOrdersPage render - showModal:', showModal, 'selectedOrder:', selectedOrder);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Quản lý Đơn hàng</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Khách hàng</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tổng tiền</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">#{order.id}</td>
                <td className="px-6 py-4 text-sm">
                  <div>
                    <div className="font-medium">{order.user?.fullName || 'N/A'}</div>
                    <div className="text-gray-500">{order.user?.email || 'N/A'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  {Number(order.totalAmount).toLocaleString('vi-VN')} ₫
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusColor(order.status)}`}
                    style={{ 
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1rem 1rem',
                      paddingRight: '2rem'
                    }}
                  >
                    <option value="PENDING">🏷️ Chờ xử lý</option>
                    <option value="PAID">✅ Đã thanh toán</option>
                    <option value="SHIPPED">🚚 Đang giao</option>
                    <option value="COMPLETED">✅ Hoàn thành</option>
                    <option value="CANCELED">❌ Đã hủy</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Button clicked for order:', order.id);
                        showOrderDetail(order);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="Xem chi tiết"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có đơn hàng nào
          </div>
        )}
      </div>

      {/* Debug Modal State */}
      {showModal && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded z-[10000]">
          Modal State: {showModal ? 'true' : 'false'}, Order: {selectedOrder?.id || 'null'}
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && selectedOrder.id && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chi tiết đơn hàng #{selectedOrder?.id || 'N/A'}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin khách hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Thông tin khách hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Họ tên:</span>
                    <span className="ml-2">{selectedOrder.customerName || selectedOrder.user?.fullName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="ml-2">{selectedOrder.customerEmail || selectedOrder.user?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Số điện thoại:</span>
                    <span className="ml-2">{selectedOrder.customerPhone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Địa chỉ giao hàng:</span>
                    <span className="ml-2">{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* Thông tin đơn hàng */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Thông tin đơn hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Ngày đặt:</span>
                    <span className="ml-2">
                      {selectedOrder.createdAt 
                        ? new Date(selectedOrder.createdAt).toLocaleString('vi-VN')
                        : 'Không xác định'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Trạng thái:</span>
                    <div className="ml-2">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => {
                          updateOrderStatus(selectedOrder.id, e.target.value);
                          setSelectedOrder({...selectedOrder, status: e.target.value});
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusColor(selectedOrder.status)}`}
                        style={{ 
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1rem 1rem',
                          paddingRight: '2rem'
                        }}
                      >
                        <option value="PENDING">🏷️ Chờ xử lý</option>
                        <option value="PAID">✅ Đã thanh toán</option>
                        <option value="SHIPPED">🚚 Đang giao</option>
                        <option value="COMPLETED">✅ Hoàn thành</option>
                        <option value="CANCELED">❌ Đã hủy</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phương thức thanh toán:</span>
                    <span className="ml-2">{getPaymentMethodText(selectedOrder.paymentMethod || '')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Tổng tiền:</span>
                    <span className="ml-2 font-semibold text-green-600">
                      {Number(selectedOrder.totalAmount).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                Sản phẩm đã đặt
              </h3>
              <div className="space-y-3">
                {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map((item) => {
                  const productColors = getProductColors(item.product);
                  return (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name || 'Tên sản phẩm không có'}</p>
                        <p className="text-sm text-gray-600">Số lượng: {item.quantity || 0}</p>
                        
                        {/* Màu sắc đã chọn sẽ được hiển thị khi có dữ liệu từ đơn hàng */}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold">{Number(item.price || 0).toLocaleString('vi-VN')} ₫</p>
                        <p className="text-sm text-gray-600">
                          Tổng: {(Number(item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-4 text-gray-500">
                    Không có sản phẩm nào trong đơn hàng
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
