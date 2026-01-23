import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-lg z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-full px-5 py-2.5">

            <span className="text-lg font-semibold text-white">Cabana</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-base font-medium">
              Features
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors text-base font-medium">
              Testimonials
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-base font-medium">
              Pricing
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors text-base font-medium">
              FAQs
            </a>
          </div>

          {/* CTA Button */}
          <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
            Get Cabana
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;