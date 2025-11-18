import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../shared/api";
import ProductCard from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        console.log("HomePage: Loading products...");
        api.get("/products", { params: { pageSize: 8 } })
            .then((res) => {
                console.log("HomePage: Products loaded:", res.data);
                setProducts(res.data.items || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("HomePage: Error loading products:", err);
                setError("Không thể tải sản phẩm");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center py-20">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div className="w-full">
            {/* Hero Banner */}
            <section className="bg-[#211c24] text-white py-20 relative min-h-[600px] overflow-hidden">
                <div className="container mx-auto px-40 flex items-center justify-between relative z-10">
                    <div className="flex flex-col gap-6 max-w-[400px]">
                        <p className="text-2xl font-semibold opacity-40">
                            Pro.Beyond.
                        </p>
                        <h1 className="text-[96px] font-thin leading-tight tracking-tight whitespace-nowrap">
                            iPhone 14 <span className="font-semibold">Pro</span>
                        </h1>
                        <p className="text-lg text-[#909090]">
                            Created to change everything for the better. For
                            everyone
                        </p>
                        <Link
                            to="/products"
                            className="border border-white rounded-md px-14 py-4 text-center text-base font-medium w-fit hover:bg-white hover:text-black transition"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>

                <img
                    src="./src/assets/hero_banner1.png"
                    alt="iPhone 14 Pro"
                    className="absolute w-[400px] right-20 top-20 "
                />
            </section>

            {/* Category Section */}
            <section className="bg-neutral-50 py-20">
                <div className="container mx-auto px-40">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-medium">
                            Browse By Category
                        </h2>
                        <div className="flex gap-4">
                            <ChevronLeft className="w-8 h-8 cursor-pointer hover:opacity-70" />
                            <ChevronRight className="w-8 h-8 cursor-pointer hover:opacity-70" />
                        </div>
                    </div>

                    <div className="flex gap-8">
                        {[
                            {
                                name: "Phones",
                                img: "https://cdn-icons-png.flaticon.com/128/186/186239.png",
                            },
                            {
                                name: "Smart Watches",
                                img: "https://cdn-icons-png.flaticon.com/128/3978/3978929.png",
                            },
                            {
                                name: "Cameras",
                                img: "https://cdn-icons-png.flaticon.com/128/1042/1042339.png",
                            },
                            {
                                name: "Headphones",
                                img: "https://cdn-icons-png.flaticon.com/128/3791/3791461.png",
                            },
                            {
                                name: "Computers",
                                img: "https://cdn-icons-png.flaticon.com/128/2704/2704414.png",
                            },
                            {
                                name: "Gaming",
                                img: "https://cdn-icons-png.flaticon.com/128/1374/1374723.png",
                            },
                        ].map((cat) => (
                            <div
                                key={cat.name}
                                className="bg-[#ededed] rounded-[15px] px-12 py-6 flex flex-col items-center gap-2 min-w-[160px] h-32 justify-center cursor-pointer hover:bg-[#e0e0e0] transition"
                            >
                                <img
                                    src={cat.img}
                                    alt={cat.name}
                                    className="w-12 h-12 object-contain mb-2"
                                />
                                <p className="text-base font-medium whitespace-nowrap">
                                    {cat.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="bg-white py-14">
                <div className="container mx-auto px-40">
                    <div className="flex gap-8 mb-8">
                        <div className="flex flex-col">
                            <p className="text-lg font-medium mb-2">
                                New Arrival
                            </p>
                            <div className="h-0.5 w-full bg-black" />
                        </div>
                        <p className="text-lg font-medium text-[#8b8b8b]">
                            Bestseller
                        </p>
                        <p className="text-lg font-medium text-[#8b8b8b]">
                            Featured Products
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/*Sale section*/}
            <section>
                <div className="relative">
                    <img src="./src/assets/sale.png" alt="sale banner" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <h2 className="text-white text-5xl font-bold">Big Summer Sale</h2>
                        <p className="text-white font-light opacity-80 pb-8">Commodo fames vitae vitae leo mauris in. Eu consequat.</p>
                        <Link
                            to="/products"
                            className="border border-white rounded-md px-14 py-4 text-center text-white font-medium w-fit hover:bg-white hover:text-black transition"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
