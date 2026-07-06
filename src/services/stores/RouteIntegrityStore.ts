import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import ServiceRepository from '@/repositories/ServiceRepository'
import DateHelper from '@/helpers/DateHelper'
import { RouteIntegrityMetric } from '@/types/RouteIntegrityMetric'
import ToastService from '@/services/ToastService'
import i18n from '@/plugins/i18n'

// Private, non-reactive last-request-wins guard for getReport.
let reportRequestToken = 0

export const useRouteIntegrityStore = defineStore('routeIntegrityStore', {
  state: () => {
    return {
      rows: Array<RouteIntegrityMetric>(),
      loading: false,
      filter: {
        from: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
        to: DateHelper.stringNow()
      }
    }
  },
  actions: {
    async getReport(): Promise<void> {
      const from = DateHelper.getFromDate(this.filter.from)
      const to = DateHelper.getToDate(this.filter.to)
      const token = ++reportRequestToken
      this.loading = true

      await ServiceRepository.getRouteIntegrityReport({ from, to })
        .then((response) => {
          if (token !== reportRequestToken) return
          this.rows.splice(0)
          response.forEach((row) => this.rows.push(row))
          this.loading = false
        })
        .catch(async (e) => {
          if (token !== reportRequestToken) return
          this.loading = false
          await ToastService.toast(
            ToastService.ERROR,
            i18n.global.t('common.messages.error'),
            e?.message
          )
        })
    }
  }
})
