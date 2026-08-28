import axiosInstance from './axiosInstance'

const unwrap = (response) => response.data

const normalizeAuthData = (data) => {
  const account = data.user || data.worker || data.admin
  return {
    ...data,
    user: account,
    token: data.accessToken,
  }
}

export async function loginUser({ mobile, password }) {
  const response = await axiosInstance.post('/auth/user/login', { mobile, password })
  const body = unwrap(response)
  return { ...body, data: normalizeAuthData(body.data) }
}

export async function loginWithIdentifier({ identifier, password }) {
  const response = await axiosInstance.post('/auth/login', { identifier, password })
  const body = unwrap(response)
  return { ...body, data: normalizeAuthData(body.data) }
}

export async function loginWorker({ workerID, password }) {
  const response = await axiosInstance.post('/auth/worker/login', { workerID, password })
  const body = unwrap(response)
  return { ...body, data: normalizeAuthData(body.data) }
}

export async function signupUser(payload) {
  const { confirmPassword, ...signupPayload } = payload || {}
  const response = await axiosInstance.post('/auth/user/signup', signupPayload)
  const body = unwrap(response)
  return { ...body, data: normalizeAuthData(body.data) }
}

export async function signupWorker(payload) {
  const response = await axiosInstance.post('/auth/worker/signup', {
    name: payload.name,
    mobile: payload.mobile,
    password: payload.password,
    country: payload.country,
    state: payload.state,
    district: payload.district,
    city: payload.city,
    pincode: payload.pincode,
  })

  return unwrap(response)
}

export async function logout() {
  const response = await axiosInstance.post('/auth/logout')
  return unwrap(response)
}
