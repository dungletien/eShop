import Breadcrumb from "../components/Breadcrumb";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40 py-6 md:py-10">
                <Breadcrumb
                    items={[
                        { label: "Về chúng tôi" },
                    ]}
                />

                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8 mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Về Cyber Store</h1>
                    
                    <div className="prose max-w-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                            <div className="order-2 lg:order-1">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Câu chuyện của chúng tôi</h2>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-3 md:mb-4">
                                    Cyber Store được thành lập với sứ mệnh mang đến những sản phẩm công nghệ 
                                    chất lượng cao với giá cả phải chăng cho mọi người. Chúng tôi tin rằng công 
                                    nghệ không chỉ là công cụ mà còn là cầu nối giúp con người kết nối và phát triển.
                                </p>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    Từ những ngày đầu khởi nghiệp, chúng tôi đã không ngừng nỗ lực để trở thành 
                                    điểm đến tin cậy cho những ai yêu thích công nghệ và đổi mới.
                                </p>
                            </div>
                            <div className="bg-gray-200 rounded-lg h-48 md:h-64 flex items-center justify-center order-1 lg:order-2">
                                <img src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29tcGFueXxlbnwwfHwwfHx8MA%3D%3D" alt="Hình ảnh công ty" className="w-full h-full object-cover rounded-lg" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            <div className="text-center p-4 md:p-6 bg-blue-50 rounded-lg">
                                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">10+</div>
                                <div className="text-sm md:text-base text-gray-700">Năm kinh nghiệm</div>
                            </div>
                            <div className="text-center p-4 md:p-6 bg-green-50 rounded-lg">
                                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">50K+</div>
                                <div className="text-sm md:text-base text-gray-700">Khách hàng hài lòng</div>
                            </div>
                            <div className="text-center p-4 md:p-6 bg-purple-50 rounded-lg">
                                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1 md:mb-2">1000+</div>
                                <div className="text-sm md:text-base text-gray-700">Sản phẩm đa dạng</div>
                            </div>
                        </div>

                        <div className="mb-6 md:mb-8">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Giá trị cốt lõi</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="border-l-4 border-blue-500 pl-3 md:pl-4 py-2">
                                    <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Chất lượng</h3>
                                    <p className="text-xs md:text-sm text-gray-600">Cam kết mang đến những sản phẩm chất lượng cao từ các thương hiệu uy tín.</p>
                                </div>
                                <div className="border-l-4 border-green-500 pl-3 md:pl-4 py-2">
                                    <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Đổi mới</h3>
                                    <p className="text-xs md:text-sm text-gray-600">Luôn cập nhật những xu hướng công nghệ mới nhất trên thị trường.</p>
                                </div>
                                <div className="border-l-4 border-purple-500 pl-3 md:pl-4 py-2">
                                    <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Khách hàng</h3>
                                    <p className="text-xs md:text-sm text-gray-600">Đặt sự hài lòng của khách hàng lên hàng đầu trong mọi hoạt động.</p>
                                </div>
                                <div className="border-l-4 border-red-500 pl-3 md:pl-4 py-2">
                                    <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Tin cậy</h3>
                                    <p className="text-xs md:text-sm text-gray-600">Xây dựng mối quan hệ lâu dài dựa trên sự tin tưởng và minh bạch.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4 md:p-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">Tầm nhìn & Sứ mệnh</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Tầm nhìn</h3>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        Trở thành nền tảng mua sắm công nghệ hàng đầu, nơi mọi người có thể 
                                        tìm thấy những sản phẩm công nghệ phù hợp với nhu cầu và ngân sách.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 text-sm md:text-base">Sứ mệnh</h3>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        Kết nối con người với công nghệ thông qua việc cung cấp sản phẩm 
                                        chất lượng, dịch vụ xuất sắc và trải nghiệm mua sắm tuyệt vời.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
