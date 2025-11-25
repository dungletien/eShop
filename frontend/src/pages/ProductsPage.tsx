import { useEffect, useState } from "react";
import { api } from "../shared/api";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [loading, setLoading] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
        new Set()
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params: any = {
                pageSize: 12,
                page: currentPage,
            };
            if (selectedCategory) params.categoryId = selectedCategory;
            if (sortBy) params.sortBy = sortBy;

            const res = await api.get("/products", { params });
            setProducts(res.data.items || []);
            setTotalProducts(res.data.total || 0);
            setTotalPages(Math.ceil((res.data.total || 0) / 12));
        } catch (error) {
            console.error("Error loading products:", error);
            alert("Lỗi khi tải sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data || []);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [selectedCategory, sortBy, currentPage]);

    // Reset trang về 1 khi thay đổi danh mục hoặc sắp xếp
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, sortBy]);

    const toggleCategory = (categoryId: number) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const parentCategories = categories.filter((cat) => !cat.parentId);

    return (
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40 py-6 md:py-10">
            <Breadcrumb items={[{ label: "Sản phẩm" }]} />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 md:mb-8">
                Sản phẩm
            </h1>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Sidebar danh mục */}
                <div className="w-full lg:w-64 bg-white border border-gray-200 rounded-lg p-4 md:p-6 h-fit mb-6 lg:mb-0">
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
                        Danh mục
                    </h3>
                    <div className="space-y-1 md:space-y-2">
                        <button
                            onClick={() => {
                                setSelectedCategory("");
                                setExpandedCategories(new Set<number>());
                            }}
                            className={`w-full text-left px-2 md:px-3 py-2 text-sm md:text-base rounded-lg hover:bg-gray-100 transition ${
                                selectedCategory === ""
                                    ? "bg-gray-100 font-medium"
                                    : ""
                            }`}
                        >
                            Tất cả sản phẩm
                        </button>
                        {parentCategories.map((category) => (
                            <div key={category.id}>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => {
                                            const isCurrentlySelected =
                                                selectedCategory ===
                                                category.id.toString();
                                            const isCurrentlyExpanded =
                                                expandedCategories.has(
                                                    category.id
                                                );

                                            if (
                                                isCurrentlySelected &&
                                                isCurrentlyExpanded
                                            ) {
                                                // Nếu đang chọn và đang mở → đóng danh mục con
                                                const newExpanded =
                                                    new Set<number>();
                                                setExpandedCategories(
                                                    newExpanded
                                                );
                                            } else {
                                                // Chọn danh mục mới → đóng tất cả danh mục con khác và mở danh mục này
                                                setSelectedCategory(
                                                    category.id.toString()
                                                );
                                                if (
                                                    category.children &&
                                                    category.children.length > 0
                                                ) {
                                                    const newExpanded = new Set(
                                                        [category.id]
                                                    );
                                                    setExpandedCategories(
                                                        newExpanded
                                                    );
                                                } else {
                                                    setExpandedCategories(
                                                        new Set()
                                                    );
                                                }
                                            }
                                        }}
                                        className={`flex-1 text-left px-2 md:px-3 py-2 text-sm md:text-base rounded-lg hover:bg-gray-100 transition ${
                                            selectedCategory ===
                                            category.id.toString()
                                                ? "bg-gray-100 font-medium"
                                                : ""
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                    {category.children &&
                                        category.children.length > 0 && (
                                            <button
                                                onClick={() =>
                                                    toggleCategory(category.id)
                                                }
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                {expandedCategories.has(
                                                    category.id
                                                ) ? (
                                                    <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                                                )}
                                            </button>
                                        )}
                                </div>
                                {/* Danh mục con */}
                                {expandedCategories.has(category.id) &&
                                    category.children && (
                                        <div className="ml-3 md:ml-4 mt-2 space-y-1">
                                            {category.children.map(
                                                (child: any) => (
                                                    <button
                                                        key={child.id}
                                                        onClick={() =>
                                                            setSelectedCategory(
                                                                child.id.toString()
                                                            )
                                                        }
                                                        className={`w-full text-left px-2 md:px-3 py-2 text-xs md:text-sm rounded-lg hover:bg-gray-100 transition ${
                                                            selectedCategory ===
                                                            child.id.toString()
                                                                ? "bg-gray-100 font-medium"
                                                                : ""
                                                        }`}
                                                    >
                                                        {child.name}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="flex-1">
                    {/* Bộ lọc */}
                    <div className="flex flex-col sm:flex-row justify-between sm:justify-end gap-4 mb-6 md:mb-8">
                        {/* Thông tin tổng sản phẩm */}
                        <div className="flex items-center text-sm md:text-base text-gray-600">
                            Hiển thị {products.length} trong số {totalProducts}{" "}
                            sản phẩm
                        </div>

                        {/* Sắp xếp theo giá */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 pr-8 md:pr-10 text-xs md:text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-black cursor-pointer w-full sm:w-auto"
                            >
                                <option value="">Sắp xếp theo</option>
                                <option value="price_asc">
                                    Giá: Thấp đến cao
                                </option>
                                <option value="price_desc">
                                    Giá: Cao đến thấp
                                </option>
                                <option value="name_asc">Tên: A-Z</option>
                                <option value="name_desc">Tên: Z-A</option>
                            </select>
                            <ChevronDown className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 md:py-20 text-sm md:text-base">
                            Đang tải...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 md:py-20 text-gray-500 text-sm md:text-base">
                            Không tìm thấy sản phẩm
                        </div>
                    ) : (
                        <>
                            {/* Grid responsive: 1→2→3→4 cột */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>

                            {/* Phân trang */}
                            {totalPages > 1 && (
                                <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2">
                                    <button
                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                                    >
                                        Trước
                                    </button>

                                    {/* Hiển thị số trang thông minh cho mobile */}
                                    {(() => {
                                        const showPages = [];
                                        const maxPagesToShow =
                                            window.innerWidth < 640
                                                ? 3
                                                : totalPages;

                                        if (totalPages <= maxPagesToShow) {
                                            // Hiển thị tất cả nếu ít trang
                                            for (
                                                let i = 1;
                                                i <= totalPages;
                                                i++
                                            ) {
                                                showPages.push(i);
                                            }
                                        } else {
                                            // Logic phân trang thông minh cho mobile
                                            if (currentPage <= 2) {
                                                showPages.push(1, 2, 3);
                                            } else if (
                                                currentPage >=
                                                totalPages - 1
                                            ) {
                                                showPages.push(
                                                    totalPages - 2,
                                                    totalPages - 1,
                                                    totalPages
                                                );
                                            } else {
                                                showPages.push(
                                                    currentPage - 1,
                                                    currentPage,
                                                    currentPage + 1
                                                );
                                            }
                                        }

                                        return showPages.map((page) => (
                                            <button
                                                key={page}
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                                className={`px-3 md:px-4 py-2 border rounded-lg text-xs md:text-sm ${
                                                    currentPage === page
                                                        ? "bg-black text-white border-black"
                                                        : "border-gray-300 hover:bg-gray-100"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ));
                                    })()}

                                    <button
                                        onClick={() =>
                                            setCurrentPage(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                                    >
                                        Tiếp
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
