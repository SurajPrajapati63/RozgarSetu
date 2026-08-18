export function Avatar({ name, photo, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'h-16 w-16 text-lg' : size === 'sm' ? 'h-10 w-10 text-sm' : 'h-12 w-12 text-base'

  if (photo) {
    return <img src={photo} alt={name} className={`${sizeClass} rounded-full object-cover`} loading="lazy" />
  }

  const initials = (name || 'W').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  return <div className={`${sizeClass} flex items-center justify-center rounded-full bg-secondary font-semibold text-white`}>{initials}</div>
}
