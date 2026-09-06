import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es'

dayjs.extend(utc)
dayjs.extend(timezone)

export const BOGOTA_TIMEZONE = 'America/Bogota'
export const PERIOD_HISTORY_MONTHS = 12

export type Translate = (key: string, params?: Record<string, number>) => string

export function currentBogotaPeriod(): string {
  return dayjs().tz(BOGOTA_TIMEZONE).format('YYYY-MM')
}

// Resolves an i18n key, falling back to `fallback` when vue-i18n returns the
// key itself (i.e. the translation is missing).
export function fallbackLabel(
  t: Translate,
  key: string,
  fallback: string,
  params?: Record<string, number>
): string {
  const translated = t(key, params ?? {})
  return translated === key ? fallback : translated
}

// Last `PERIOD_HISTORY_MONTHS` YYYY-MM periods (Bogota time, most recent first),
// plus `selected` if it falls outside that window.
export function periodOptions(selected?: string): string[] {
  const current = dayjs().tz(BOGOTA_TIMEZONE)
  const periods: string[] = []
  for (let i = 0; i < PERIOD_HISTORY_MONTHS; i++) {
    periods.push(current.subtract(i, 'month').format('YYYY-MM'))
  }
  if (selected && !periods.includes(selected)) {
    periods.push(selected)
    periods.sort((a, b) => (a > b ? -1 : 1))
  }
  return periods
}

export function periodLabel(period: string, locale: string): string {
  const dayjsLocale = locale === 'es' ? 'es' : 'en'
  const value = dayjs(`${period}-01`).locale(dayjsLocale).format('MMMM YYYY')
  return value.charAt(0).toUpperCase() + value.slice(1)
}
