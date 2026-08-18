import { MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react'

const steps = [
  { title: 'Describe the job', icon: MessageSquareText, text: 'Post your requirement and get matched to local experts quickly.' },
  { title: 'Compare and choose', icon: Sparkles, text: 'Review profiles, ratings and availability before booking.' },
  { title: 'Confirm and pay securely', icon: ShieldCheck, text: 'Complete the booking and manage it from your dashboard.' },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
        <h2 className="text-3xl font-semibold text-slate-900">Simple, safe and quick</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="card text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary">
                <Icon size={22} />
              </div>
              <div className="mb-2 text-sm font-semibold text-primary">Step {index + 1}</div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
