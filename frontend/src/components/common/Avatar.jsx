import { useState } from 'react'

export function Avatar({ name, photo, size = 'md' }) {
  const [hasError, setHasError] = useState(false)
  const sizeClass = size === 'lg' ? 'h-16 w-16 text-lg' : size === 'sm' ? 'h-10 w-10 text-sm' : 'h-12 w-12 text-base'

  if (photo && !hasError) {
    return (
      <img
        src={photo}
        alt={name || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover shadow-sm`}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    )
  }

  const initials = (name || 'W').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  return <div className={`${sizeClass} flex items-center justify-center rounded-full bg-secondary font-semibold text-white shadow-sm`}>{initials}</div>
}
