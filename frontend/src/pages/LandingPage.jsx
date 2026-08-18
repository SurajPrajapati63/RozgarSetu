import { useState } from 'react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { HeroSection } from '../components/landing/HeroSection'
import { CategoryFilter } from '../components/landing/CategoryFilter'
import { WorkerGrid } from '../components/landing/WorkerGrid'
import { FeaturedWorkers } from '../components/landing/FeaturedWorkers'
import { HowItWorks } from '../components/landing/HowItWorks'
import { TestimonialsSection } from '../components/landing/TestimonialsSection'
import { StatsSection } from '../components/landing/StatsSection'

export default function LandingPage() {
  const [filters, setFilters] = useState({ category: '', city: '', rating: '', available: false })
  const [selectedCategory, setSelectedCategory] = useState('')

  const handleSearch = ({ city, category }) => {
    setFilters((current) => ({ ...current, city: city || '', category: category || '' }))
    setSelectedCategory(category || '')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <HeroSection onSearch={handleSearch} />
      <section id="browse-workers" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Browse workers</p>
            <h2 className="text-3xl font-semibold text-slate-900">Find the right expert near you</h2>
          </div>
          <CategoryFilter selected={selectedCategory} filters={filters} onFiltersChange={setFilters} onSelect={(category) => {
            setSelectedCategory(category)
            setFilters((current) => ({ ...current, category }))
          }} />
        </div>
        <WorkerGrid filters={filters} />
      </section>
      <FeaturedWorkers />
      <HowItWorks />
      <TestimonialsSection />
      <StatsSection />
      <Footer />
    </div>
  )
}
