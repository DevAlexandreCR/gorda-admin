import dayjs from 'dayjs'

export default class DateHelper {
  static unixToDate(unix: number,  format: string): string {
    return dayjs(unix * 1000).format(format)
  }
}