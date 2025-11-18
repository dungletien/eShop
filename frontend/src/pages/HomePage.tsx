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
            <section className="bg-[#211c24] text-white py-10 md:py-16 lg:py-20 relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden">
                <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40 flex flex-col lg:flex-row lg:items-center lg:justify-between relative z-10 h-full">
                    <div className="flex flex-col gap-4 md:gap-6 max-w-full lg:max-w-[400px] text-center lg:text-left">
                        <p className="text-lg md:text-xl lg:text-2xl font-semibold opacity-40">
                            Pro.Beyond.
                        </p>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[96px] font-thin leading-tight tracking-tight">
                            iPhone 14 <span className="font-semibold">Pro</span>
                        </h1>
                        <p className="text-base md:text-lg text-[#909090] px-4 lg:px-0">
                            Created to change everything for the better. For
                            everyone
                        </p>
                        <Link
                            to="/products"
                            className="border border-white rounded-md px-8 md:px-12 lg:px-14 py-3 md:py-4 text-center text-sm md:text-base font-medium w-fit mx-auto lg:mx-0 hover:bg-white hover:text-black transition"
                        >
                            Shop Now
                        </Link>
                    </div>
                    <div className="mt-8 lg:mt-0 flex justify-center lg:block">
                        <img
                            src="./src/assets/hero_banner1.png"
                            alt="iPhone 14 Pro"
                            className="w-64 sm:w-80 md:w-96 lg:w-[400px] lg:absolute lg:right-20 lg:top-20"
                        />
                    </div>
                </div>
            </section>

            {/* Category Section */}
            <section className="bg-white py-10 md:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-medium mb-4 sm:mb-0 text-center sm:text-left">
                            Browse By Category
                        </h2>
                        <div className="flex gap-4 justify-center sm:justify-end">
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 cursor-pointer hover:opacity-70" />
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 cursor-pointer hover:opacity-70" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
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
                                className="bg-[#ededed] rounded-[15px] px-4 md:px-8 lg:px-12 py-4 md:py-6 flex flex-col items-center gap-2 h-24 md:h-28 lg:h-32 justify-center cursor-pointer hover:bg-[#e0e0e0] transition"
                            >
                                <img
                                    src={cat.img}
                                    alt={cat.name}
                                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain mb-1 md:mb-2"
                                />
                                <p className="text-xs md:text-sm lg:text-base font-medium text-center leading-tight">
                                    {cat.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="bg-neutral-50 py-10 md:py-14">
                <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8 overflow-x-auto">
                        <div className="flex flex-col min-w-fit">
                            <p className="text-base md:text-lg font-medium mb-2 text-center sm:text-left">
                                New Arrival
                            </p>
                            <div className="h-0.5 w-full bg-black" />
                        </div>
                        <p className="text-base md:text-lg font-medium text-[#8b8b8b] min-w-fit text-center sm:text-left">
                            Bestseller
                        </p>
                        <p className="text-base md:text-lg font-medium text-[#8b8b8b] min-w-fit text-center sm:text-left">
                            Featured Products
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="w-full">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/*Sale section*/}
            <section className="px-4 sm:px-8 md:px-16 lg:px-0">
                <div className="relative md:rounded-xl lg:rounded-2xl">
                    <img
                        src="./src/assets/sale.png"
                        alt="sale banner"
                        className="w-full h-48 sm:h-64 md:h-80 lg:h-auto object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                            Big Summer Sale
                        </h2>
                        <p className="text-white font-light opacity-80 pb-4 md:pb-6 lg:pb-8 text-sm md:text-base max-w-md">
                            Commodo fames vitae vitae leo mauris in. Eu
                            consequat.
                        </p>
                        <Link
                            to="/products"
                            className="border border-white rounded-md px-8 md:px-12 lg:px-14 py-3 md:py-4 text-center text-white font-medium text-sm md:text-base w-fit hover:bg-white hover:text-black transition"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
