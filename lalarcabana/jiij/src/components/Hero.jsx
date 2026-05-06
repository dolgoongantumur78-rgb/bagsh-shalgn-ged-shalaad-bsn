const Hero = ({ isVisible }) => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto text-center">
        <h1 
          data-animate
          className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent transition-all duration-1000 ${
            isVisible['hero-title'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="hero-title"
        >
          Design <span className="italic">faster</span>
          <br />
          Launch <span className="italic">sooner</span>
        </h1>
        <p 
          data-animate
          className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible['hero-subtitle'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="hero-subtitle"
        >
          Ship pixel-perfect designs without starting from scratch 🚀
        </p>
        <div 
          data-animate
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-300 ${
            isVisible['hero-buttons'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="hero-buttons"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
            Watch Figma Trailer
          </button>
          <button className="px-8 py-4 bg-gray-800 border-2 border-gray-700 text-white rounded-lg text-lg font-semibold hover:border-gray-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            Watch Framer Trailer
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero

