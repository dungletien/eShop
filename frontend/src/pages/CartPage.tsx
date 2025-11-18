import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../shared/api";
import { Trash2 } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

type CartItem = {
    id: number;
    quantity: number;
    product: { id: number; name: string; price: string };
};

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadCart = async () => {
        try {
            const res = await api.get("/cart");
            setItems(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const total = items.reduce(
        (s, i) => s + Number(i.product.price) * i.quantity,
        0
    );

    const updateQty = async (productId: number, quantity: number) => {
        if (quantity < 1) return;
        await api.put(`/cart/${productId}`, { quantity });
        loadCart();
    };

    const removeItem = async (productId: number) => {
        await api.delete(`/cart/${productId}`);
        loadCart();
    };

    if (loading) return <div className="text-center py-20">Đang tải...</div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40 py-6 md:py-10">
            <Breadcrumb items={[{ label: "Giỏ hàng" }]} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6 md:mb-8 mt-4 md:mt-6">Giỏ hàng</h1>

            {items.length === 0 ? (
                <div className="text-center py-12 md:py-20">
                    <p className="text-gray-500 mb-4 text-sm md:text-base">
                        Giỏ hàng của bạn đang trống
                    </p>
                    <Link
                        to="/products"
                        className="text-black font-medium hover:underline text-sm md:text-base"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 space-y-3 md:space-y-4 mb-6 lg:mb-0">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 md:p-6"
                            >
                                {/* Mobile Layout */}
                                <div className="flex flex-col sm:hidden">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 pr-2">
                                            <h3 className="font-medium text-base mb-1">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-lg font-semibold text-black">
                                                {Number(
                                                    item.product.price
                                                ).toLocaleString("vi-VN")}{" "}
                                                ₫
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                removeItem(item.product.id)
                                            }
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    updateQty(
                                                        item.product.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-sm"
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQty(
                                                        item.product.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Layout */}
                                <div className="hidden sm:flex items-center gap-4 md:gap-6">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-base md:text-lg mb-1 md:mb-2">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-lg md:text-xl font-semibold">
                                            {Number(
                                                item.product.price
                                            ).toLocaleString("vi-VN")}{" "}
                                            ₫
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <button
                                            onClick={() =>
                                                updateQty(
                                                    item.product.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="w-7 h-7 md:w-8 md:h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-sm"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 md:w-12 text-center font-medium text-sm md:text-base">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQty(
                                                    item.product.id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="w-7 h-7 md:w-8 md:h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <button
                                            onClick={() =>
                                                removeItem(item.product.id)
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 h-fit sticky top-4">
                        <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
                            Tổng kết
                        </h2>
                        <div className="border-b border-gray-200 pb-3 md:pb-4 mb-3 md:mb-4">
                            <div className="flex justify-between mb-2 text-sm md:text-base">
                                <span>Tạm tính:</span>
                                <span>{total.toLocaleString("vi-VN")} ₫</span>
                            </div>
                            <div className="flex justify-between font-semibold text-base md:text-lg">
                                <span>Tổng cộng:</span>
                                <span>{total.toLocaleString("vi-VN")} ₫</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/checkout")}
                            className="w-full bg-black text-white py-2 md:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm md:text-base"
                        >
                            Thanh toán
                        </button>
                        <Link
                            to="/products"
                            className="block text-center mt-3 md:mt-4 text-gray-600 hover:text-black text-sm md:text-base"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
