import { useState, useEffect, useRef } from 'react'

export const useAnimation = () => {
  const [isVisible, setIsVisible] = useState({})
  const observerRef = useRef(null)

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.id) {
              setIsVisible((prev) => ({
                ...prev,
                [entry.target.id]: true,
              }))
            }
          })
        },
        { threshold: 0.1 }
      )

      const elements = document.querySelectorAll('[data-animate]')
      elements.forEach((el) => {
        if (el.id && observerRef.current) {
          observerRef.current.observe(el)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return isVisible
}

