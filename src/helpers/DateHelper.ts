import dayjs from 'dayjs'

export default class DateHelper {
  static unixToDate(unix: number,  format: string): string {
    return dayjs(unix * 1000).format(format)
  }
  
  static unix(): number {
    return dayjs().unix()
  }
  
  static aGo(unix: number): string {
    if (unix > 3600) {
      const hours = Math.trunc(unix / 3600)
      const min = Math.trunc((unix % 3600) / 60)
      const s = Math.trunc((unix % 3600) % 60)
      return `${hours}h:${min}m:${s}s`
    } else if (unix > 60) {
      const min = Math.floor((unix / 60))
      const s = unix % 60
      return `${min}m:${s}s`
    } else {
      return `${unix}s`
    }
  }
}