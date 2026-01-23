const TrustedBy = ({ isVisible }) => {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i}
            />
          ))}
        </div>
      
    </section>
  )
}

export default TrustedBy

