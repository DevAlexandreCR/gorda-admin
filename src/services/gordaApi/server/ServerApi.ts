import axios from 'axios'

const API_BASE = process.env.VUE_APP_WP_CLIENT_API_URL
const API_PORT = process.env.VUE_APP_WP_CLIENT_API_PORT
const API_KEY = process.env.VUE_APP_GORDA_API_KEY

const serverApi = axios.create({
  baseURL: `${API_BASE}:${API_PORT}`,
})

if (API_KEY) {
  serverApi.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`
}

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean
  message?: string
  data: T
}

export default serverApi
