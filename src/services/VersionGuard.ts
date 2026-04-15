import axios, { AxiosError } from 'axios'
import packageJson from '../../package.json'

const API_BASE = process.env.VUE_APP_WP_CLIENT_API_URL as string ?? 'http://localhost'
const API_PORT = process.env.VUE_APP_WP_CLIENT_API_PORT ?? 3000
const APP_TITLE = process.env.VUE_APP_TITLE ?? 'Gorda Admin'
const VERSION_UNSUPPORTED_CODE = 'client_version_unsupported'

interface VersionPolicyResponse {
  success: boolean
  data: {
    versionPolicy: {
      admin: {
        minVersion: string
      }
    }
  }
}

export const ADMIN_APP_VERSION = packageJson.version

function parseVersionPart(value: string): number {
  const normalized = value.trim()
  if (!normalized) return 0

  const parsed = Number.parseInt(normalized, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export function compareVersions(current: string, minimum: string): number {
  const currentParts = current.split('.').map(parseVersionPart)
  const minimumParts = minimum.split('.').map(parseVersionPart)
  const maxLength = Math.max(currentParts.length, minimumParts.length)

  for (let index = 0; index < maxLength; index += 1) {
    const currentPart = currentParts[index] ?? 0
    const minimumPart = minimumParts[index] ?? 0

    if (currentPart > minimumPart) return 1
    if (currentPart < minimumPart) return -1
  }

  return 0
}

function getRootElement(): HTMLElement | null {
  return document.getElementById('app')
}

export function renderVersionBlockedScreen(minVersion: string, message?: string): void {
  const root = getRootElement()
  if (!root) return

  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f7fb;padding:24px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 18px 48px rgba(15,23,42,.10);text-align:center;">
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#64748b;margin-bottom:12px;">${APP_TITLE}</div>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#0f172a;">Update required</h1>
        <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6;">${message ?? 'This admin build is no longer supported. Reload the page to load the latest version.'}</p>
        <div style="margin:0 0 24px;padding:14px 16px;border-radius:12px;background:#eef2ff;color:#1e293b;font-size:14px;">
          <strong>Current:</strong> ${ADMIN_APP_VERSION}<br/>
          <strong>Minimum:</strong> ${minVersion}
        </div>
        <button id="reload-admin-version" style="border:0;border-radius:999px;padding:12px 22px;background:#0f172a;color:#ffffff;font-weight:600;cursor:pointer;">Reload</button>
      </div>
    </div>
  `

  const button = document.getElementById('reload-admin-version')
  button?.addEventListener('click', () => {
    window.location.reload()
  })
}

export function handleVersionUnsupported(minVersion: string, message?: string): void {
  renderVersionBlockedScreen(minVersion, message)
}

export async function ensureAdminVersionSupported(): Promise<boolean> {
  try {
    const response = await axios.get<VersionPolicyResponse>(
      `${API_BASE}:${API_PORT}/public/master-data/version-policy`
    )

    const minVersion = response.data.data.versionPolicy.admin.minVersion
    if (compareVersions(ADMIN_APP_VERSION, minVersion) < 0) {
      renderVersionBlockedScreen(minVersion)
      return false
    }

    return true
  } catch (error) {
    const axiosError = error as AxiosError<{
      data?: {
        admin?: {
          minVersion?: string
        }
        code?: string
      }
    }>
    const minVersion = axiosError.response?.data?.data?.admin?.minVersion ?? ADMIN_APP_VERSION
    const code = axiosError.response?.data?.data?.code
    const isUnsupported = code === VERSION_UNSUPPORTED_CODE

    renderVersionBlockedScreen(
      minVersion,
      isUnsupported
        ? 'This admin build is no longer supported. Reload the page to continue.'
        : 'The version check could not be completed. Reload the page to continue.'
    )
    return false
  }
}
