import ApiResponse from '../utils/apiResponse.js';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAP_API_KEY || process.env.GOOGLE_MAP_API || '';
const PLACEHOLDER_API_KEY_VALUES = new Set([
  'your_google_maps_api_key_here',
  'your_google_map_api_key_here',
  'your_google_maps_api_key',
]);

const hasGoogleMapsApiKey = () => {
  const key = GOOGLE_MAPS_API_KEY.trim();
  return Boolean(key) && !PLACEHOLDER_API_KEY_VALUES.has(key.toLowerCase());
};

const mapsApiNotConfigured = (res) => ApiResponse.error(
  res,
  'Location search is unavailable. Configure a valid GOOGLE_MAPS_API_KEY.',
  503,
);

const fetchGoogleMaps = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } finally {
    clearTimeout(timeout);
  }
};

export const autocomplete = async (req, res) => {
  const { input, types } = req.query;
  if (!input) return ApiResponse.error(res, 'Input query is required', 400);
  if (!hasGoogleMapsApiKey()) return mapsApiNotConfigured(res);

  try {
    const params = new URLSearchParams({
      input,
      key: GOOGLE_MAPS_API_KEY,
      ...(types && { types }),
    });

    const { response, data } = await fetchGoogleMaps(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`,
    );

    if (!response.ok || (data.status !== 'OK' && data.status !== 'ZERO_RESULTS')) {
      return ApiResponse.error(res, data.error_message || 'Autocomplete request failed', 502);
    }

    const predictions = (data.predictions || []).map((p) => ({
      placeId: p.place_id,
      description: p.description,
      mainText: p.structured_formatting?.main_text,
      secondaryText: p.structured_formatting?.secondary_text,
    }));

    return ApiResponse.success(res, predictions);
  } catch (err) {
    const message = err.name === 'AbortError'
      ? 'Location search timed out. Please try again.'
      : 'Failed to fetch autocomplete suggestions';
    return ApiResponse.error(res, message, 502);
  }
};

export const placeDetails = async (req, res) => {
  const { placeId } = req.query;
  if (!placeId) return ApiResponse.error(res, 'placeId is required', 400);
  if (!hasGoogleMapsApiKey()) return mapsApiNotConfigured(res);

  try {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'address_components,formatted_address,geometry',
      key: GOOGLE_MAPS_API_KEY,
    });

    const { response, data } = await fetchGoogleMaps(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
    );

    if (!response.ok || data.status !== 'OK') {
      return ApiResponse.error(res, data.error_message || 'Place details request failed', 502);
    }

    const components = data.result?.address_components || [];
    const getComponent = (type) => {
      const comp = components.find((c) => c.types.includes(type));
      return comp?.long_name || '';
    };

    const result = {
      formattedAddress: data.result?.formatted_address || '',
      country: getComponent('country'),
      state: getComponent('administrative_area_level_1'),
      district: getComponent('administrative_area_level_2') || getComponent('administrative_area_level_3'),
      city: getComponent('locality') || getComponent('sublocality_level_1') || getComponent('administrative_area_level_3'),
      pincode: getComponent('postal_code'),
      lat: data.result?.geometry?.location?.lat,
      lng: data.result?.geometry?.location?.lng,
    };

    return ApiResponse.success(res, result);
  } catch (err) {
    const message = err.name === 'AbortError'
      ? 'Location details request timed out. Please try again.'
      : 'Failed to fetch place details';
    return ApiResponse.error(res, message, 502);
  }
};

export default { autocomplete, placeDetails };
