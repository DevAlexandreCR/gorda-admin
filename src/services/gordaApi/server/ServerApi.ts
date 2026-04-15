import axios from 'axios'
import { ADMIN_APP_VERSION, handleVersionUnsupported } from '@/services/VersionGuard'

const API_BASE = process.env.VUE_APP_WP_CLIENT_API_URL
const API_PORT = process.env.VUE_APP_WP_CLIENT_API_PORT
const API_KEY = process.env.VUE_APP_GORDA_API_KEY

const serverApi = axios.create({
  baseURL: `${API_BASE}:${API_PORT}`,
})

if (API_KEY) {
  serverApi.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`
}

serverApi.defaults.headers.common['X-Client-Platform'] = 'admin'
serverApi.defaults.headers.common['X-Client-Version'] = ADMIN_APP_VERSION

serverApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 426 && error.response?.data?.data?.admin?.minVersion) {
      handleVersionUnsupported(error.response.data.data.admin.minVersion)
    }

    return Promise.reject(error)
  }
)

export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean
  message?: string
  data: T
}

export default serverApi
