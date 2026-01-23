const Testimonials = ({ isVisible }) => {
  const testimonials = [
    { 
      quote: "It blows my mind how detailed the Cabana system is. It's definitely one of the best design systems out there, without a doubt.",
      author: "Namya Khann",
      role: "Creator of Supafast"
    },
    {
      quote: "I have only good things to say about Cabana. There's nothing it hasn't been able to do for me since I've been using it.",
      author: "Jess Eddy",
      role: "@jesseddy"
    },
    {
      quote: "There's few products out there that make designing in Figma so easy. It's streamlined my process, making things more efficient, and much more enjoyable.",
      author: "Gabe Silva",
      role: "@iamgsilva"
    },
    {
      quote: "Really sped up prototyping, making it easy for a developer like me to get something together on Figma.",
      author: "Amr Yousef",
      role: "@amrfarid140"
    },
    {
      quote: "Cabana fundamentally changed how we work. It's the most scaleable, well thought out design system out there.",
      author: "Adrian Forster",
      role: "@adrianforster"
    },
    {
      quote: "Cabana is everything you need to design kick-ass products! Totally worth the money for a developer like me.",
      author: "Lazar Nikolov",
      role: "@NikolovLazar"
    },
  ]

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 
          data-animate
          className={`text-4xl md:text-5xl font-bold text-center mb-16 text-white transition-all duration-1000 ${
            isVisible['testimonials-title'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="testimonials-title"
        >
          Trusted by 20,000+ Designers & Developers.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              data-animate
              className={`p-6 bg-gray-900 border border-gray-800 rounded-xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                isVisible[`testimonial-${index}`] ? 'animate-scale-in' : 'opacity-0'
              }`}
              id={`testimonial-${index}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

