import { useState } from "react";
import { Calendar, User, Tag, Search, ArrowRight } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

// Mock data cho blog posts
const blogPosts = [
    {
        id: 1,
        title: "5 Xu hướng công nghệ nổi bật năm 2024",
        excerpt: "Khám phá những xu hướng công nghệ đang định hình tương lai và cách chúng ảnh hưởng đến cuộc sống hàng ngày.",
        content: "Năm 2024 đánh dấu một bước ngoặt quan trọng trong sự phát triển của công nghệ...",
        author: "Nguyễn Tech",
        date: "2024-11-15",
        category: "Công nghệ",
        image: "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        featured: true
    },
    {
        id: 2,
        title: "Cách chọn laptop phù hợp với nhu cầu học tập",
        excerpt: "Hướng dẫn chi tiết giúp bạn lựa chọn chiếc laptop hoàn hảo cho việc học tập và làm việc.",
        content: "Việc chọn laptop phù hợp là một quyết định quan trọng...",
        author: "Trần Văn A",
        date: "2024-11-12",
        category: "Hướng dẫn",
        image: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFwdG9wJTIwY29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 3,
        title: "Review chi tiết iPhone 15 Pro Max",
        excerpt: "Đánh giá toàn diện về chiếc flagship mới nhất của Apple với những cải tiến đáng chú ý.",
        content: "iPhone 15 Pro Max đã chính thức ra mắt với nhiều nâng cấp...",
        author: "Lê Thị B",
        date: "2024-11-10",
        category: "Review",
        image: "https://images.unsplash.com/photo-1695048133021-be2def43f3b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aXBob25lJTIwMTV8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 4,
        title: "Tương lai của trí tuệ nhân tạo trong đời sống",
        excerpt: "AI đang thay đổi cách chúng ta sống và làm việc như thế nào?",
        content: "Trí tuệ nhân tạo không còn là khái niệm xa vời...",
        author: "Phạm AI",
        date: "2024-11-08",
        category: "AI",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 5,
        title: "Top 10 phụ kiện không thể thiếu cho game thủ",
        excerpt: "Danh sách những phụ kiện gaming giúp nâng cao trải nghiệm chơi game của bạn.",
        content: "Để có trải nghiệm gaming tốt nhất, bạn cần những phụ kiện...",
        author: "Gaming Pro",
        date: "2024-11-05",
        category: "Gaming",
        image: "https://images.unsplash.com/photo-1567094764148-bb14c3e6f14c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWNjZXNzb3J5JTIwZ2FtZXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        id: 6,
        title: "Bảo mật thông tin cá nhân trên thiết bị di động",
        excerpt: "Những biện pháp bảo vệ thông tin cá nhân hiệu quả trên smartphone và tablet.",
        content: "Bảo mật thông tin cá nhân là vấn đề cực kỳ quan trọng...",
        author: "Security Expert",
        date: "2024-11-03",
        category: "Bảo mật",
        image: "https://plus.unsplash.com/premium_photo-1661878265739-da90bc1af051?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VjdXJpdHl8ZW58MHx8MHx8fDA%3D"
    }
];

const categories = ["Tất cả", "Công nghệ", "Hướng dẫn", "Review", "AI", "Gaming", "Bảo mật"];

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === "Tất cả" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = blogPosts.find(post => post.featured);
    const regularPosts = filteredPosts.filter(post => !post.featured || selectedCategory !== "Tất cả" || searchTerm);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40 py-6 md:py-10">
                <Breadcrumb
                    items={[
                        { label: "Blog" },
                    ]}
                />

                {/* Header */}
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Blog Cyber Store</h1>
                    <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                        Khám phá những xu hướng công nghệ mới nhất, hướng dẫn sử dụng sản phẩm và 
                        những bài review chi tiết từ đội ngũ chuyên gia của chúng tôi.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 focus:border-black rounded-lg focus:outline-none focus:ring-0 text-sm md:text-base"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium transition ${
                                        selectedCategory === category
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Post */}
                {featuredPost && selectedCategory === "Tất cả" && !searchTerm && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 md:mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="bg-gray-200 h-48 md:h-64 lg:h-auto flex items-center justify-center order-1 lg:order-1">
                                <img 
                                    src={featuredPost.image} 
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 md:p-6 lg:p-8 order-2 lg:order-2">
                                <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
                                    <span className="bg-red-100 text-red-800 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                                        Nổi bật
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                                        {featuredPost.category}
                                    </span>
                                </div>
                                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3 md:w-4 md:h-4" />
                                            <span className="truncate">{featuredPost.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                            <span className="truncate">{new Date(featuredPost.date).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                    <button className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base">
                                        Đọc tiếp <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {regularPosts.map(post => (
                        <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                            <div className="bg-gray-200 h-40 md:h-48 flex items-center justify-center">
                                <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 md:p-6">
                                <div className="flex items-center gap-2 mb-2 md:mb-3">
                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {post.category}
                                    </span>
                                </div>
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            <span className="truncate">{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span className="truncate">{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium text-right sm:text-center">
                                        Đọc tiếp
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* No results */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-8 md:py-12 px-4">
                        <p className="text-gray-500 text-sm md:text-base lg:text-lg">
                            Không tìm thấy bài viết nào phù hợp với từ khóa "{searchTerm}" 
                            {selectedCategory !== "Tất cả" && ` trong danh mục "${selectedCategory}"`}.
                        </p>
                    </div>
                )}

                {/* Load More Button */}
                {filteredPosts.length > 0 && (
                    <div className="text-center mt-8 md:mt-12">
                        <button className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium hover:opacity-90 transition text-sm md:text-base">
                            Xem thêm bài viết
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
