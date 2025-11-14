import { useEffect, useState } from "react";
import { api } from "../../shared/api";
import { Plus, Edit, Trash2, X, Save, Upload, Image } from "lucide-react";

type Product = {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    categoryId: number;
    images?: any;
    colors?: any;
};

type Category = {
    id: number;
    name: string;
    parentId?: number;
    children?: Category[];
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: 0,
        categoryId: 0,
        images: "",
    });
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedParentCategory, setSelectedParentCategory] = useState<number>(0);
    const [childCategories, setChildCategories] = useState<Category[]>([]);

    // Danh sách màu sắc có sẵn
    const availableColors = [
        { name: "Đen", value: "#000000" },
        { name: "Trắng", value: "#FFFFFF" },
        { name: "Đỏ", value: "#FF0000" },
        { name: "Xanh dương", value: "#0000FF" },
        { name: "Xanh lá", value: "#00FF00" },
        { name: "Vàng", value: "#FFFF00" },
        { name: "Cam", value: "#FFA500" },
        { name: "Tím", value: "#800080" },
        { name: "Hồng", value: "#FFC0CB" },
        { name: "Xám", value: "#808080" },
        { name: "Nâu", value: "#A52A2A" },
        { name: "Xanh navy", value: "#000080" },
    ];

    // Function để xử lý URL ảnh
    const getImageUrl = (imageUrl: string): string => {
        if (!imageUrl) return "https://via.placeholder.com/48x48?text=No+Image";

        // Nếu đã là URL đầy đủ (http/https)
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl;
        }

        // Nếu là đường dẫn tương đối từ uploads
        if (imageUrl.startsWith("/uploads/")) {
            return `http://localhost:4000${imageUrl}`;
        }

        // Nếu chỉ là filename hoặc đường dẫn không có /uploads/
        if (!imageUrl.startsWith("/")) {
            return `http://localhost:4000/uploads/products/${imageUrl}`;
        }

        // Fallback
        return `http://localhost:4000${imageUrl}`;
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get("/products", { params: { pageSize: 100 } }),
                api.get("/categories"),
            ]);
            setProducts(productsRes.data.items || []);
            setCategories(categoriesRes.data || []);
        } catch (error) {
            console.error(error);
            alert("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        const parentCategories = categories.filter(cat => !cat.parentId);
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            stock: 0,
            categoryId: 0,
            images: "",
        });
        setUploadedImages([]);
        setSelectedColors([]);
        setSelectedParentCategory(0);
        setChildCategories([]);
        setShowModal(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);

        // Xử lý images từ nhiều định dạng khác nhau
        let existingImages: string[] = [];

        if (product.images) {
            if (Array.isArray(product.images)) {
                existingImages = product.images;
            } else if (typeof product.images === "string") {
                try {
                    // Thử parse JSON
                    const parsedImages = JSON.parse(product.images);
                    if (Array.isArray(parsedImages)) {
                        existingImages = parsedImages;
                    } else {
                        existingImages = [product.images]; // Coi như là URL đơn
                    }
                } catch {
                    // Nếu không parse được, split bằng comma
                    existingImages = product.images
                        .split(",")
                        .map((img) => img.trim())
                        .filter(Boolean);
                }
            }
        }

        // Xử lý colors từ product
        let existingColors: string[] = [];
        if (product.colors) {
            if (Array.isArray(product.colors)) {
                existingColors = product.colors;
            } else if (typeof product.colors === "string") {
                try {
                    const parsedColors = JSON.parse(product.colors);
                    if (Array.isArray(parsedColors)) {
                        existingColors = parsedColors;
                    }
                } catch {
                    // Nếu không parse được, coi như là màu đơn
                    existingColors = [product.colors];
                }
            }
        }

        // Xác định danh mục cha và con
        const selectedCategory = categories.find(cat => cat.id === product.categoryId);
        let parentCategoryId = 0;
        let childCategoriesList: Category[] = [];
        
        if (selectedCategory) {
            if (selectedCategory.parentId) {
                // Nếu là danh mục con
                parentCategoryId = selectedCategory.parentId;
                const parentCategory = categories.find(cat => cat.id === selectedCategory.parentId);
                if (parentCategory && parentCategory.children) {
                    childCategoriesList = parentCategory.children;
                }
            } else {
                // Nếu là danh mục cha
                parentCategoryId = selectedCategory.id;
                if (selectedCategory.children) {
                    childCategoriesList = selectedCategory.children;
                }
            }
        }

        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            categoryId: product.categoryId,
            images: "",
        });
        setUploadedImages(existingImages);
        setSelectedColors(existingColors);
        setSelectedParentCategory(parentCategoryId);
        setChildCategories(childCategoriesList);
        setShowModal(true);
    };

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append("image", file);
                const response = await api.post("/upload/single", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                return response.data.imageUrl;
            });

            const newImageUrls = await Promise.all(uploadPromises);
            setUploadedImages((prev) => [...prev, ...newImageUrls]);

            alert("Upload hình ảnh thành công!");
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi upload hình ảnh");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (imageUrl: string) => {
        const updatedImages = uploadedImages.filter((img) => img !== imageUrl);
        setUploadedImages(updatedImages);
    };

    const handleColorToggle = (colorValue: string) => {
        if (selectedColors.includes(colorValue)) {
            setSelectedColors(selectedColors.filter(c => c !== colorValue));
        } else {
            setSelectedColors([...selectedColors, colorValue]);
        }
    };

    const handleParentCategoryChange = (parentCategoryId: number) => {
        setSelectedParentCategory(parentCategoryId);
        setFormData({ ...formData, categoryId: parentCategoryId });
        
        // Tìm danh mục con của danh mục cha được chọn
        const parentCategory = categories.find(cat => cat.id === parentCategoryId);
        if (parentCategory && parentCategory.children) {
            setChildCategories(parentCategory.children);
        } else {
            setChildCategories([]);
        }
    };

    const handleSave = async () => {
        try {
            if (!formData.categoryId) {
                alert("Vui lòng chọn danh mục");
                return;
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(String(formData.stock)),
                categoryId: formData.categoryId,
                images: uploadedImages,
                colors: selectedColors,
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                alert("Cập nhật sản phẩm thành công");
            } else {
                await api.post("/products", payload);
                alert("Tạo sản phẩm thành công");
            }
            setShowModal(false);
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi lưu sản phẩm");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            await api.delete(`/products/${id}`);
            alert("Xóa sản phẩm thành công");
            loadData();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
        }
    };

    if (loading) return <div className="text-center py-20">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Quản lý Sản phẩm</h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                    <Plus className="w-5 h-5" />
                    Thêm sản phẩm
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Hình ảnh
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Tên
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Giá
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Tồn kho
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => {
                            let firstImage = null;

                            // Xử lý nhiều trường hợp dữ liệu images
                            if (product.images) {
                                if (
                                    Array.isArray(product.images) &&
                                    product.images.length > 0
                                ) {
                                    firstImage = product.images[0];
                                } else if (typeof product.images === "string") {
                                    // Nếu images là string JSON
                                    try {
                                        const parsedImages = JSON.parse(
                                            product.images
                                        );
                                        if (
                                            Array.isArray(parsedImages) &&
                                            parsedImages.length > 0
                                        ) {
                                            firstImage = parsedImages[0];
                                        }
                                    } catch {
                                        // Nếu không parse được, coi như là URL đơn
                                        firstImage = product.images;
                                    }
                                }
                            }

                            return (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 text-sm">
                                        {product.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {firstImage ? (
                                            <img
                                                src={getImageUrl(firstImage)}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded border"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://via.placeholder.com/48x48?text=Error";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                                                <Image className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {Number(product.price).toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        ₫
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(product)
                                                }
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">
                                {editingProduct
                                    ? "Sửa sản phẩm"
                                    : "Thêm sản phẩm"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tên sản phẩm
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Giá (₫)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Tồn kho
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                stock:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Danh mục
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Dropdown danh mục cha */}
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Danh mục cha
                                        </label>
                                        <select
                                            value={selectedParentCategory}
                                            onChange={(e) => handleParentCategoryChange(parseInt(e.target.value))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        >
                                            <option value={0}>Chọn danh mục cha</option>
                                            {categories.filter(cat => !cat.parentId).map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Dropdown danh mục con */}
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Danh mục con (tùy chọn)
                                        </label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    categoryId: parseInt(e.target.value),
                                                })
                                            }
                                            disabled={childCategories.length === 0}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value={selectedParentCategory}>
                                                {selectedParentCategory === 0 
                                                    ? "Chọn danh mục cha trước" 
                                                    : "Sử dụng danh mục cha"}
                                            </option>
                                            {childCategories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Màu sắc sản phẩm
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {availableColors.map((color) => (
                                        <div
                                            key={color.value}
                                            className={`relative border-2 rounded-lg p-3 cursor-pointer transition ${
                                                selectedColors.includes(color.value)
                                                    ? "border-black bg-gray-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => handleColorToggle(color.value)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: color.value }}
                                                ></div>
                                                <span className="text-sm font-medium">{color.name}</span>
                                            </div>
                                            {selectedColors.includes(color.value) && (
                                                <div className="absolute top-1 right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                    ✓
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {selectedColors.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-600">
                                            Đã chọn {selectedColors.length} màu: {" "}
                                            {selectedColors.map(colorValue => {
                                                const color = availableColors.find(c => c.value === colorValue);
                                                return color?.name;
                                            }).join(", ")}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Hình ảnh sản phẩm
                                </label>

                                {/* Upload từ máy tính */}
                                <div className="mb-4">
                                    <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition w-fit">
                                        <Upload className="w-5 h-5" />
                                        {uploading
                                            ? "Đang upload..."
                                            : "Upload từ máy tính"}
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Chọn một hoặc nhiều file hình ảnh (JPG,
                                        PNG, GIF)
                                    </p>
                                </div>

                                {/* Hiển thị hình ảnh đã upload */}
                                {uploadedImages.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium mb-2">
                                            Hình ảnh đã upload (
                                            {uploadedImages.length}):
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {uploadedImages.map(
                                                (imageUrl, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative group"
                                                    >
                                                        <img
                                                            src={getImageUrl(
                                                                imageUrl
                                                            )}
                                                            alt={`Product ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-20 object-cover rounded border"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    "https://via.placeholder.com/80x80?text=Error";
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveImage(
                                                                    imageUrl
                                                                )
                                                            }
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                            >
                                <Save className="w-5 h-5" />
                                Lưu
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
