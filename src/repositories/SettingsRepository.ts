import { SettingsInterface, SettingsRideFees } from '@/types/SettingsInterface'
import DBService from '@/services/DBService'
import { DataSnapshot, get, off, onValue, query, ref, set } from 'firebase/database'

class SettingsRepository {

	/* istanbul ignore next */
	async getSettings(): Promise<SettingsInterface> {
		const snapshot: DataSnapshot = await get(DBService.dbSettings())
		return <SettingsInterface>snapshot.val()
	}

	/* istanbul ignore next */
	async updateRideFeeField(fieldName: string, value: number): Promise<void> {
		await set(ref(DBService.db, `settings/ride_fees/${fieldName}`), value);
	}

	/* istanbul ignore next */
	async getRideFees(): Promise<SettingsRideFees> {
		const snapshot: DataSnapshot = await get(ref(DBService.db, 'settings/ride_fees'))
		return <SettingsRideFees>snapshot.val()
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