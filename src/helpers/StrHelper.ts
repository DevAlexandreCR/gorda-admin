export class StrHelper {
	
	static toCamelCase(str: string): string {
		str = str.toLowerCase()
		const arr = str.split(' ')
		for (let i = 0; i < arr.length; i++) {
			arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
		}
		return arr.join(' ')
	}
	static formatNumber(search = ''): string {
		const num = search.includes('+56')? -9 : -10
		return search
			.replace(' ', '')
			.replace(/[^\d]/g, "")
			.slice(num)
	}
	
	static formatPlate(plate: string): string {
		return plate
			.toUpperCase()
			.replace(/\s+/g, '')
			.trim()
	}
}