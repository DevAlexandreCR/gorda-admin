import DBService from '@/services/DBService'
import { DataSnapshot, get, off, onValue, query, ref, set } from 'firebase/database'
import { SettingsInterface } from '@/types/SettingsInterface'
import { RideFeeInterface } from '@/types/RideFeeInterface'

class SettingsRepository {

	/* istanbul ignore next */
	async getSettings(): Promise<SettingsInterface> {
		const snapshot: DataSnapshot = await get(DBService.dbSettings())
		return <SettingsInterface>snapshot.val()
	}

	/* istanbul ignore next */
	async updateRideFee(rideFee: RideFeeInterface): Promise<void> {
		await set(ref(DBService.db, `settings/ride_fees/`), rideFee)
	}

	/* istanbul ignore next */
	async getRideFees(): Promise<RideFeeInterface> {
		const snapshot: DataSnapshot = await get(ref(DBService.db, 'settings/ride_fees'))
		return <RideFeeInterface>snapshot.val()
	}

	/* istanbul ignore next */
	enableWpNotifications(enable: boolean): Promise<void> {
		return set(ref(DBService.db, 'settings/wpNotifications'), enable);
	}

	/* istanbul ignore next */
	onWpNotifications(listener: (enable: DataSnapshot) => void): void {
		onValue(query(ref(DBService.db, 'settings/wpNotifications')), listener)
	}

	/* istanbul ignore next */
	offWpNotifications(): void {
		off(query(ref(DBService.db, 'settings/wpNotifications')), 'value')
	}
}
export default new SettingsRepository()