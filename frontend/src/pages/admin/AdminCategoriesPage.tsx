import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../shared/api";
import {
    Plus,
    Edit,
    Trash2,
    X,
    Save,
    Info,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

type Category = {
    id: number;
    name: string;
    parentId: number | null;
};

type FormState = {
    name: string;
    parentId: number;
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
        new Set()
    );
    const [formData, setFormData] = useState<FormState>({
        name: "",
        parentId: 0,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data || []);
        } catch (error) {
            console.error(error);
            alert("Lỗi khi tải danh mục");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({
            name: "",
            parentId: 0,
        });
        setShowModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            parentId: category.parentId || 0,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: formData.name,
                parentId: formData.parentId ? formData.parentId : null,
            };

            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, payload);
                alert("Cập nhật danh mục thành công");
            } else {
                await api.post("/categories", payload);
                alert("Thêm danh mục thành công");
            }

            setShowModal(false);
            loadCategories();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi lưu danh mục");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await api.delete(`/categories/${id}`);
            alert("Xóa danh mục thành công");
            loadCategories();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi xóa danh mục");
        }
    };

    const parentOptions = useMemo(() => {
        // Chỉ cho phép chọn danh mục cha (parentId === null) làm parent
        return categories.filter(
            (cat) => cat.id !== editingCategory?.id && cat.parentId === null
        );
    }, [categories, editingCategory]);

    // Tách danh mục cha và danh mục con
    const parentCategories = useMemo(() => {
        return categories.filter((cat) => cat.parentId === null);
    }, [categories]);

    const getChildCategories = (parentId: number) => {
        return categories.filter((cat) => cat.parentId === parentId);
    };

    const toggleExpanded = (categoryId: number) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    if (loading) return <div className="text-center py-20">Đang tải...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Quản lý Danh mục</h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                    <Plus className="w-5 h-5" />
                    Thêm danh mục
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
                                Tên danh mục
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Danh mục con
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {parentCategories.map((category) => {
                            const childCategories = getChildCategories(
                                category.id
                            );
                            const isExpanded = expandedCategories.has(
                                category.id
                            );

                            return (
                                <React.Fragment key={category.id}>
                                    {/* Danh mục cha */}
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm">
                                            {category.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {childCategories.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <span>
                                                        {childCategories.length}{" "}
                                                        danh mục con
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            toggleExpanded(
                                                                category.id
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                        title="Xem danh mục con"
                                                    >
                                                        <Info className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span>
                                                    Không có danh mục con
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(category)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            category.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Danh mục con (hiển thị khi expanded) */}
                                    {isExpanded &&
                                        childCategories.map((childCategory) => (
                                            <tr
                                                key={`child-${childCategory.id}`}
                                                className="bg-gray-25 hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 text-sm pl-12">
                                                    {childCategory.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm pl-12 text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <ChevronRight className="w-3 h-3 text-gray-400" />
                                                        {childCategory.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    Danh mục con
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    childCategory
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    childCategory.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">
                                {editingCategory
                                    ? "Sửa danh mục"
                                    : "Thêm danh mục"}
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
                                    Tên danh mục
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
                                    Danh mục cha
                                </label>
                                <select
                                    value={formData.parentId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            parentId: parseInt(
                                                e.target.value,
                                                10
                                            ),
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value={0}>Không có</option>
                                    {parentOptions.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
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
