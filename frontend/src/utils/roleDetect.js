export function detectRole(input = '') {
  const value = input.trim()
  if (!value) return 'unknown'
  if (value.startsWith('WRK-')) return 'worker'
  if (/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value)) return 'admin'
  if (/^\d{10}$/.test(value)) return 'user'
  return 'unknown'
}

export function getRoleLabel(input = '') {
  const role = detectRole(input)
  if (role === 'worker') return 'Worker'
  if (role === 'admin') return 'Admin'
  if (role === 'user') return 'User'
  return 'Unknown'
}
