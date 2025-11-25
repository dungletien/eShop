import { Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-12 md:py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 lg:mb-8">
                    {/* Company Info */}
                    <div className="flex flex-col gap-4 lg:gap-6 max-w-full lg:max-w-[384px] mb-8 lg:mb-0">
                        <div className="text-2xl font-semibold text-white">
                            cyber
                        </div>
                        <p className="text-sm text-[#cfcfcf] leading-relaxed">
                            We are a residential interior design firm located in
                            Portland. Our boutique-studio offers more than
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-[113px]">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-base font-semibold mb-2">
                                Services
                            </h3>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Bonus program
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Gift cards
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Credit and payment
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Service contracts
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Non-cash account
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Payment
                            </a>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-base font-semibold mb-2">
                                Assistance to the buyer
                            </h3>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Find an order
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Terms of delivery
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Exchange and return of goods
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Guarantee
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Frequently asked questions
                            </a>
                            <a
                                href="#"
                                className="text-sm text-[#cfcfcf] hover:text-white transition-colors"
                            >
                                Terms of use of the site
                            </a>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 border-t border-gray-800 lg:border-t-0 lg:pt-0">
                    <Twitter className="w-5 h-5 sm:w-4 sm:h-4 cursor-pointer hover:opacity-70 transition-opacity" />
                    <Facebook className="w-5 h-5 sm:w-4 sm:h-4 cursor-pointer hover:opacity-70 transition-opacity" />
                    <Instagram className="w-5 h-5 sm:w-4 sm:h-4 cursor-pointer hover:opacity-70 transition-opacity" />
                </div>
            </div>
        </footer>
    );
}
