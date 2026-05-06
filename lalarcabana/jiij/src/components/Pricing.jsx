import React from 'react';

const Pricing = ({ isVisible }) => {
  const plans = [
    {
      name: 'Individual',
      price: '$119',
      originalPrice: '$169',
      description: 'Single User License',
      features: [
        'Includes everything in Figma and Framer',
        'Bonus Tokens Studio Tutorial',
        'Access to the Tokens Studio Slack Community',
        'Receive 25% OFF Framer (Pro Annual Subscription)',
        'Receive 20% OFF Supa Palette',
        'Receive 10% OFF Charts Supply',
      ],
      popular: false,
    },
    {
      name: 'Figma',
      price: '$99',
      originalPrice: '$169',
      description: 'Single User License',
      features: [
        'Includes *all* versions of Cabana for Figma',
        '3300+ Icons (Universal + Tabler)',
        '630 Text, Color and Effects Styles',
        '34 Desktop & Mobile examples',
        '3500+ Design Blocks',
      ],
      popular: false,
    },
    {
      name: 'Framer',
      price: '$79',
      originalPrice: '$169',
      description: 'Single User License',
      features: [
        'Includes Cabana for Framer',
        '200+ Smart Components',
        '6000+ Open Source Icons',
        '200+ Design Blocks',
        '170+ Color Styles',
        '120+ Gradient Styles',
        '72 Typography Styles',
      ],
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
          Choose the product that fits your needs.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 bg-gray-900 rounded-2xl border-2 border-gray-800 hover:border-blue-600 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                
                <div className="mb-4">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 line-through ml-2 text-lg">{plan.originalPrice}</span>
                  <div className="inline-block ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    SAVE {Math.round((1 - parseInt(plan.price.slice(1)) / parseInt(plan.originalPrice.slice(1))) * 100)}%
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-gray-800 text-white hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600">
                  Buy One
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          All payments are secured by 256-bit TLS Encryption.
        </p>
      </div>
    </section>
  );
};

export default Pricing;