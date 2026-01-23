const FAQ = ({ isVisible }) => {
  const questions = [
    'What is the difference between the Framer and Figma products?',
    'How is Cabana different from other Design Systems or UI Kits?',
    'How can I be confident in the product before making a purchase?',
    'Is there a discount for Students or Tutors?',
    'Does Cabana for Figma include the latest Figma features?',
  ]

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto">
        <h2 
          data-animate
          className={`text-4xl md:text-5xl font-bold text-center mb-16 text-white transition-all duration-1000 ${
            isVisible['faq-title'] ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          id="faq-title"
        >
          Oh, and if you have any questions…
        </h2>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              data-animate
              className={`p-6 bg-gray-900 border border-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer ${
                isVisible[`faq-${index}`] ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              id={`faq-${index}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-white">{question}</p>
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ

