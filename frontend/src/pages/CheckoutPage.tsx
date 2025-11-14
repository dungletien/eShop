import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../shared/api";
import Breadcrumb from "../components/Breadcrumb";

export default function CheckoutPage() {
    const [customerInfo, setCustomerInfo] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("cash"); // 'cash' hoặc 'transfer'
    const [loading, setLoading] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [cartLoading, setCartLoading] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!customerInfo.fullName.trim()) {
            alert("Vui lòng nhập họ tên");
            return;
        }
        if (!customerInfo.phone.trim()) {
            alert("Vui lòng nhập số điện thoại");
            return;
        }
        if (!customerInfo.email.trim()) {
            alert("Vui lòng nhập email");
            return;
        }
        if (!customerInfo.address.trim()) {
            alert("Vui lòng nhập địa chỉ giao hàng");
            return;
        }

        setLoading(true);
        try {
            await api.post("/orders", {
                address: customerInfo.address,
                customerInfo,
                paymentMethod,
            });
            alert("Đặt hàng thành công!");
            navigate("/orders");
        } catch (error: any) {
            alert(error.response?.data?.message || "Đặt hàng thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setCustomerInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Load cart items
    const loadCart = async () => {
        setCartLoading(true);
        try {
            const response = await api.get("/cart");
            setCartItems(response.data || []);
        } catch (error) {
            console.error("Error loading cart:", error);
            setCartItems([]);
        } finally {
            setCartLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + Number(item.product?.price || 0) * item.quantity;
    }, 0);

    const shippingFee = 30000; // Phí vận chuyển cố định
    const total = subtotal + shippingFee;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-40 py-8">
                <Breadcrumb
                    items={[
                        { label: "Giỏ hàng", path: "/cart" },
                        { label: "Thanh toán" },
                    ]}
                />

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Thanh toán đơn hàng
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Thông tin khách hàng - Cột 1 */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                        1
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Thông tin giao hàng
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.fullName}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "fullName",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerInfo.phone}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={customerInfo.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="Nhập email"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Địa chỉ giao hàng *
                                        </label>
                                        <textarea
                                            value={customerInfo.address}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Phương thức thanh toán */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                        2
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Phương thức thanh toán
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {/* Tiền mặt */}
                                    <div
                                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                            paymentMethod === "cash"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <label className="flex items-start gap-4 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cash"
                                                checked={
                                                    paymentMethod === "cash"
                                                }
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-5 h-5 text-blue-600 mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-semibold text-gray-900">
                                                        💵 Thanh toán tiền mặt
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Thanh toán khi nhận hàng
                                                    (COD)
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Chuyển khoản */}
                                    <div
                                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                            paymentMethod === "transfer"
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <label className="flex items-start gap-4 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="transfer"
                                                checked={
                                                    paymentMethod === "transfer"
                                                }
                                                onChange={(e) =>
                                                    setPaymentMethod(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-5 h-5 text-blue-600 mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-semibold text-gray-900">
                                                        🏦 Chuyển khoản ngân
                                                        hàng
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Chuyển khoản qua QR Code
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Tóm tắt đơn hàng */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Tóm tắt đơn hàng
                                </h3>

                                {cartLoading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Đang tải...
                                        </p>
                                    </div>
                                ) : cartItems.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-600">
                                            Giỏ hàng trống
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Danh sách sản phẩm */}
                                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                            {cartItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {item.product?.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                                            <span>
                                                                Số lượng:{" "}
                                                                {item.quantity}
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {Number(
                                                                    item.product
                                                                        ?.price ||
                                                                        0
                                                                ).toLocaleString(
                                                                    "vi-VN"
                                                                )}
                                                                ₫
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {(
                                                            Number(
                                                                item.product
                                                                    ?.price || 0
                                                            ) * item.quantity
                                                        ).toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                        ₫
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Tạm tính ({cartItems.length}{" "}
                                                    sản phẩm)
                                                </span>
                                                <span className="font-medium">
                                                    {subtotal.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Phí vận chuyển
                                                </span>
                                                <span className="font-medium">
                                                    {shippingFee.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between">
                                                    <span className="text-base font-semibold text-gray-900">
                                                        Tổng cộng
                                                    </span>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {total.toLocaleString(
                                                            "vi-VN"
                                                        )}
                                                        ₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* QR Code cho chuyển khoản */}
                                {paymentMethod === "transfer" && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                        <div className="text-center">
                                            <div className="bg-white p-3 rounded-lg inline-block shadow-sm mb-3">
                                                <img
                                                    src={`https://img.vietqr.io/image/MB-0123456789-compact2.png?amount=${total}&addInfo=Thanh%20toan%20don%20hang&accountName=CONG%20TY%20CYBER`}
                                                    alt="QR Code chuyển khoản"
                                                    className="w-40 h-40 mx-auto"
                                                />
                                            </div>
                                            <div className="text-xs space-y-1 text-gray-600">
                                                <div>
                                                    <strong>Ngân hàng:</strong>{" "}
                                                    MB Bank
                                                </div>
                                                <div>
                                                    <strong>STK:</strong>{" "}
                                                    0123456789
                                                </div>
                                                <div>
                                                    <strong>CTK:</strong> CONG
                                                    TY CYBER
                                                </div>
                                                <div>
                                                    <strong>Số tiền:</strong>{" "}
                                                    {total.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    ₫
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || cartItems.length === 0}
                                    className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang xử lý...
                                        </div>
                                    ) : (
                                        "Xác nhận đặt hàng"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
