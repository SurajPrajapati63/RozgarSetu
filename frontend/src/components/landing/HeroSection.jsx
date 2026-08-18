import { useEffect, useState } from 'react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { SearchBar } from './SearchBar'

const rotatingTexts = ['Plumbers', 'Electricians', 'Carpenters', 'Painters', 'Cleaners']

export function HeroSection({ onSearch }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % rotatingTexts.length), 1800)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur">
            <Sparkles size={16} /> Trusted local service marketplace
          </div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Find Trusted Local Workers Instantly</h1>
          <p className="mt-5 text-lg text-white/85 sm:text-xl">Book vetted <span className="font-semibold text-white">{rotatingTexts[index]}</span> and home service experts in minutes.</p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/85">
            <div className="flex items-center gap-2"><ShieldCheck size={16} /> 50,000+ Workers</div>
            <div className="flex items-center gap-2"><ShieldCheck size={16} /> 4.8 star Average Rating</div>
            <div className="flex items-center gap-2"><ShieldCheck size={16} /> Verified Profiles</div>
          </div>
        </div>
        <div className="mt-10 max-w-4xl rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </section>
  )
}
