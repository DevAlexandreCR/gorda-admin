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
  
  public static dateToUnix(date: string): number {
    return dayjs(date).unix()
  }

  public static stringNow(format = 'YYYY-MM-DD'): string
  {
    return dayjs().format(format)
  }

  public static getFromDate(date: string, format = 'YYYY-MM-DD'): number
  {
    return dayjs(date, format).startOf('day').unix()
  }

  public static getToDate(date: string, format = 'YYYY-MM-DD'): number
  {
    return dayjs(date, format).endOf('day').unix()
  }
}