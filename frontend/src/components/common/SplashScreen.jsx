import { useEffect, useState } from 'react'

export function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 3500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!fading) return undefined
    const timer = setTimeout(onFinish, 500)
    return () => clearTimeout(timer)
  }, [fading, onFinish])

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-primary transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <video src="/logoAnimation.mp4" autoPlay muted playsInline onEnded={() => setFading(true)} className="absolute h-full w-full object-cover opacity-40" />
      <img src="/logo.png" alt="WorkerLink" className="relative z-10 w-52 max-w-[70vw] object-contain drop-shadow-2xl sm:w-64" />
    </div>
  )
}
