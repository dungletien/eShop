import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
    label: string;
    path?: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-black transition-colors">
                Trang chủ
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {item.path ? (
                        <Link
                            to={item.path}
                            className="hover:text-black transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}
