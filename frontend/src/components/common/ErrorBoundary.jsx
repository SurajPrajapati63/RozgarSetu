import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="card max-w-md text-center">
            <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
            <p className="text-sm text-slate-600">The page could not be rendered. Please refresh the app and try again.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
