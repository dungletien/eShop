import { useEffect, useState } from "react";
import { api } from "../../shared/api";
import { Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";

type Order = {
    id: number;
    status: string;
    totalAmount: string;
    address: string;
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
        };
    }[];
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await api.get("/orders");
            setOrders(res.data || []);
        } catch (error) {
            console.error(error);
            alert("Lỗi khi tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: number, status: string) => {
        try {
            await api.put(`/orders/${orderId}`, { status });
            alert("Cập nhật trạng thái thành công");
            loadOrders();
        } catch (error: any) {
            alert(
                error.response?.data?.message || "Lỗi khi cập nhật trạng thái"
            );
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "text-yellow-600 bg-yellow-100";
            case "PAID":
                return "text-blue-600 bg-blue-100";
            case "SHIPPED":
                return "text-purple-600 bg-purple-100";
            case "COMPLETED":
                return "text-green-600 bg-green-100";
            case "CANCELED":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Package className="w-4 h-4" />;
            case "PAID":
                return <CheckCircle className="w-4 h-4" />;
            case "SHIPPED":
                return <Truck className="w-4 h-4" />;
            case "COMPLETED":
                return <CheckCircle className="w-4 h-4" />;
            case "CANCELED":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Chờ xử lý";
            case "PAID":
                return "Đã thanh toán";
            case "SHIPPED":
                return "Đang giao";
            case "COMPLETED":
                return "Hoàn thành";
            case "CANCELED":
                return "Đã hủy";
            default:
                return status;
        }
    };

    if (loading) return <div className="text-center py-20">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Quản lý Đơn hàng</h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Khách hàng
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Tổng tiền
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Ngày đặt
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm">
                                    #{order.id}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div>
                                        <div className="font-medium">
                                            {order.user?.fullName || "N/A"}
                                        </div>
                                        <div className="text-gray-500">
                                            {order.user?.email || "N/A"}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold">
                                    {Number(order.totalAmount).toLocaleString(
                                        "vi-VN"
                                    )}{" "}
                                    ₫
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {getStatusIcon(order.status)}
                                        {getStatusText(order.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex gap-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                updateOrderStatus(
                                                    order.id,
                                                    e.target.value
                                                )
                                            }
                                            className="text-xs border border-gray-300 rounded px-2 py-1"
                                        >
                                            <option value="PENDING">
                                                Chờ xử lý
                                            </option>
                                            <option value="PAID">
                                                Đã thanh toán
                                            </option>
                                            <option value="SHIPPED">
                                                Đang giao
                                            </option>
                                            <option value="COMPLETED">
                                                Hoàn thành
                                            </option>
                                            <option value="CANCELED">
                                                Đã hủy
                                            </option>
                                        </select>
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
        </div>
    );
}
