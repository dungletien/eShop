import { Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-24">
      <div className="container mx-auto px-40">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-6 max-w-[384px]">
            <div className="text-2xl font-semibold text-white">cyber</div>
            <p className="text-sm text-[#cfcfcf] leading-relaxed">
              We are a residential interior design firm located in Portland. Our boutique-studio offers more than
            </p>
          </div>

          <div className="flex gap-[113px]">
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold mb-2">Services</h3>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Bonus program</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Gift cards</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Credit and payment</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Service contracts</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Non-cash account</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Payment</a>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold mb-2">Assistance to the buyer</h3>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Find an order</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Terms of delivery</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Exchange and return of goods</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Guarantee</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Frequently asked questions</a>
              <a href="#" className="text-sm text-[#cfcfcf] hover:text-white">Terms of use of the site</a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Twitter className="w-4 h-4 cursor-pointer hover:opacity-70" />
          <Facebook className="w-4 h-4 cursor-pointer hover:opacity-70" />
          <Instagram className="w-4 h-4 cursor-pointer hover:opacity-70" />
        </div>
      </div>
    </footer>
  );
}

