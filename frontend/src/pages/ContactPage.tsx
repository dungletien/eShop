import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Xử lý gửi form (có thể gọi API)
        alert(
            "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất."
        );
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-40 py-10">
                <Breadcrumb items={[{ label: "Liên hệ" }]} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Thông tin liên hệ */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Thông tin liên hệ
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Địa chỉ
                                        </p>
                                        <p className="text-gray-600">
                                            123 Đường ABC, Đống Đa, Hà Nội
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Điện thoại
                                        </p>
                                        <p className="text-gray-600">
                                            +84 123 456 789
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-red-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Email
                                        </p>
                                        <p className="text-gray-600">
                                            info@cyberstore.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-purple-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Giờ làm việc
                                        </p>
                                        <p className="text-gray-600">
                                            Thứ 2 - Thứ 6: 8:00 - 18:00
                                        </p>
                                        <p className="text-gray-600">
                                            Thứ 7 - CN: 9:00 - 17:00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bản đồ */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Vị trí
                            </h3>
                            <div className="bg-gray-200 h-48 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7449.419005469103!2d105.8257770417244!3d21.004278722555398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1763413498529!5m2!1sen!2s"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Form liên hệ */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Gửi tin nhắn cho chúng tôi
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập email"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chủ đề *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nhập chủ đề"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nhập nội dung tin nhắn..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
