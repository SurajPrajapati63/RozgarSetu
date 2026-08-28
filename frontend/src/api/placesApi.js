import axiosInstance from './axiosInstance'

const unwrap = (response) => response.data

export async function getAutocompleteSuggestions(input, types = '') {
  if (!input || input.length < 3) return []
  try {
    const params = new URLSearchParams({ input })
    if (types) params.set('types', types)
    const response = await axiosInstance.get(`/places/autocomplete?${params}`)
    const body = unwrap(response)
    return body.data || []
  } catch {
    return []
  }
}

export async function getPlaceDetails(placeId) {
  if (!placeId) return null
  try {
    const response = await axiosInstance.get(`/places/details?placeId=${placeId}`)
    const body = unwrap(response)
    return body.data || null
  } catch {
    return null
  }
}
