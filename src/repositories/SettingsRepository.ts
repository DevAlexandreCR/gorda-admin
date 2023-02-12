import {SettingsInterface} from '@/types/SettingsInterface'
import DBService from '@/services/DBService'
import {DataSnapshot, get, ref, set} from 'firebase/database'

class SettingsRepository {
	
	/* istanbul ignore next */
	async getSettings(): Promise<SettingsInterface> {
		const snapshot: DataSnapshot = await get(DBService.dbSettings())
		return <SettingsInterface>snapshot.val()
	}
	
	/* istanbul ignore next */
	enableWpNotifications(enable: boolean): Promise<void> {
		return set(ref(DBService.db, 'settings/wpNotifications'), enable);
	}
}
export default new SettingsRepository()