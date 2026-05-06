import React from 'react';

const Footer = () => {
  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Column - Logo and Copyright */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="grid grid-cols-3 gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              </div>
              <span className="text-xl font-bold text-white">Cabana</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">©2025 Cabana.</p>
            <p className="text-gray-400 text-sm mb-4">All rights reserved.</p>
            <p className="text-gray-500 text-sm">
              Originally created by <span className="text-white">Marc Andrew</span>.
            </p>
          </div>

          {/* Middle Column - Navigation Links */}
          <div className="flex flex-col gap-3">
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-base">
              Home
            </a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-base">
              Features
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors text-base">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-base">
              Pricing
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors text-base">
              FAQs
            </a>
          </div>

          {/* Right Column - Action Links */}
          <div className="flex flex-col gap-3">
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-base">
              Get Cabana
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors text-base">
              Preview in Figma
            </a>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm text-center">
            Cabana is not affiliated with Figma, nor is it endorsed by or sponsored by Figma or Framer.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;