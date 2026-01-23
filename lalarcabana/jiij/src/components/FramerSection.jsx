const FramerSection = ({ isVisible }) => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 to-black">
      <div className="max-w-7xl mx-auto text-center">
        <h2 
          data-animate
          className={`text-4xl md:text-5xl font-bold mb-6 text-white transition-all duration-1000 ${
            isVisible['framer-title'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="framer-title"
        >
          Building in Framer? We're there too.
        </h2>
        <p 
          data-animate
          className={`text-xl text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible['framer-desc'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="framer-desc"
        >
          Build and launch your brand using our Design System & UI Kit for Framer, the most powerful tool for creating jaw-dropping websites (including this one 😉)
        </p>
      </div>
    </section>
  )
}

export default FramerSection

