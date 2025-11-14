import { useEffect, useState } from "react";
import { api } from "../shared/api";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";
import { ChevronDown } from "lucide-react";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [loading, setLoading] = useState(true);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const params: any = { pageSize: 20 };
            if (selectedCategory) params.categoryId = selectedCategory;
            if (sortBy) params.sortBy = sortBy;

            const res = await api.get("/products", { params });
            setProducts(res.data.items || []);
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
    }, [selectedCategory, sortBy]);

    return (
        <div className="container mx-auto px-40 py-10">
            <Breadcrumb items={[{ label: "Sản phẩm" }]} />
            <h1 className="text-4xl font-semibold mb-8">Sản phẩm</h1>

            {/* Bộ lọc */}
            <div className="flex gap-4 mb-8">
                {/* Lọc theo danh mục */}
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-black cursor-pointer"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Sắp xếp theo giá */}
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-black cursor-pointer"
                    >
                        <option value="">Sắp xếp theo</option>
                        <option value="price_asc">Giá: Thấp đến cao</option>
                        <option value="price_desc">Giá: Cao đến thấp</option>
                        <option value="name_asc">Tên: A-Z</option>
                        <option value="name_desc">Tên: Z-A</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">Đang tải...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    Không tìm thấy sản phẩm
                </div>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
