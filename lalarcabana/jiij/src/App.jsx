import './App.css'
import { useAnimation } from './hooks/useAnimation'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustedBy from './components/TrustedBy'
import Features from './components/Features'
import FramerSection from './components/FramerSection'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function App() {
  const isVisible = useAnimation()

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero isVisible={isVisible} />
      <TrustedBy isVisible={isVisible} />
      <Features isVisible={isVisible} />
      <FramerSection isVisible={isVisible} />
      <Testimonials isVisible={isVisible} />
      <Pricing isVisible={isVisible} />
      <FAQ isVisible={isVisible} />
      <Footer />
    </div>
  )
}

export default App
