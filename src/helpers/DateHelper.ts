import dayjs from 'dayjs'

export default class DateHelper {
  static unixToDate(unix: number,  format = 'YYYY-MM-DD'): string {
    return dayjs(unix * 1000).format(format)
  }
  
  static unix(): number {
    return dayjs().unix()
  }

  static startOfDayUnix(): number {
    return dayjs().startOf('day').unix()
  }

  static endOfDayUnix(): number {
    return dayjs().endOf('day').unix()
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
	
	public static arrayYears(): string[] {
		const year = dayjs().year()
		
		const years = []
		
		for(let i = (year - 20); i <= year + 1; i++) {
			years.push(i.toString())
		}
		return years.reverse()
	}

  public static stringNow(format = 'YYYY-MM-DD'): string
  {
    return dayjs().format(format)
  }

  public static getFromDate(date: string, format = 'YYYY-MM-DD'): number
  {
    return dayjs(date, format).unix()
  }
	
	public static getDayjsFromDate(date: string, format = 'YYYY-MM-DD'): dayjs.Dayjs
	{
		return dayjs(date, format)
	}

  public static getToDate(date: string, format = 'YYYY-MM-DD'): number
  {
    return dayjs(date, format).endOf('day').unix()
  }
	
	public static lastYear(): string
	{
		return dayjs().subtract(11, 'month').startOf('month').format('YYYY-MM-DD').toString()
	}

  public static getTime(start: number, end: number, metric: dayjs.UnitType = 'minutes'): string {
    return dayjs.unix(end).diff(dayjs.unix(start), metric).toString()
  }

  public static formatTimestamp(timestamp: number): { date: string, timestamp: string } {
    const date = dayjs.unix(timestamp)

    const formattedDate = date.format('D MMMM')
    const formattedTime = date.format('HH:mm')
    return {
      date: formattedDate,
      timestamp: formattedTime
    }
  }
}