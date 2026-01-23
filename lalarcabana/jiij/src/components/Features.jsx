const Features = ({ isVisible }) => {
  const features = [
    { title: 'Powerful Components', desc: 'An endless choice of Components to help speed through your projects.' },
    { title: 'Variables Support', desc: 'This latest Figma feature is implemented throughout to help you customise rapidly.' },
    { title: 'Tokens Studio Support', desc: 'Optimised for Tokens Studio enabling you much more efficiency on your projects.' },
    { title: 'Auto-Layout ready', desc: "Don't waste time messing around with Auto-Layout. Everything's done for you." },
    { title: 'Variants to the max', desc: 'Components powered by Variants to improve your workflow even more.' },
    { title: 'Design Blocks', desc: 'Assemble full page sections fast on either Desktop, Tablet or Mobile screen sizes.' },
    { title: 'Dark Mode ready', desc: 'Every Component is Dark Mode ready saving you so much valuable time.' },
    { title: 'Color System', desc: 'A massively versatile colour system based on the popular TailwindUI palette.' },
    { title: 'Typography System', desc: 'Rock-solid type system perfectly suited for any screen size you choose.' },
  ]

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 
          data-animate
          className={`text-4xl md:text-5xl font-bold text-center mb-4 text-white transition-all duration-1000 ${
            isVisible['features-title'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="features-title"
        >
          Designing in Figma? We've got you covered.
        </h2>
        <p 
          data-animate
          className={`text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible['features-subtitle'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="features-subtitle"
        >
          With Figma's most powerful features optimized for Cabana, say goodbye to the old way of working, and hello to a new and improved workflow
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-animate
              className={`p-6 bg-gray-900 border border-gray-800 rounded-xl hover:shadow-xl hover:border-blue-600 transition-all duration-500 transform hover:-translate-y-2 ${
                isVisible[`feature-${index}`] ? 'animate-scale-in' : 'opacity-0'
              }`}
              id={`feature-${index}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

