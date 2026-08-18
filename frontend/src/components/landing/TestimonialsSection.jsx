const testimonials = [
  { name: 'Nisha Rao', quote: 'I booked a plumber in under 10 minutes and the experience was seamless.' },
  { name: 'Ramesh B.', quote: 'The profile and booking flow made it easy to compare professionals.' },
  { name: 'Anita K.', quote: 'Fantastic for finding reliable local help without the usual hassle.' },
]

export function TestimonialsSection() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Testimonials</p>
          <h2 className="text-3xl font-semibold text-slate-900">Loved by customers across the city</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card">
              <p className="mb-4 text-sm text-slate-600">“{testimonial.quote}”</p>
              <div className="font-semibold text-slate-900">{testimonial.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
