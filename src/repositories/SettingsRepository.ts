import DBService from '@/services/DBService'
import {DataSnapshot, get, off, onValue, query, ref, remove, set} from 'firebase/database'
import { WpClient } from '@/types/WpClient'
import { RideFeeInterface } from '@/types/RideFeeInterface'
import {ClientDictionary} from "@/types/ClientDiccionary";
import { SettingsMessageInterface } from '@/types/SettingsMessages';
import { DocumentData, DocumentReference, QuerySnapshot, doc, getDocs, updateDoc } from 'firebase/firestore';
import FSService from '@/services/FSService';

class WpClientRepository {

	/* istanbul ignore next */
	async getWpClients(): Promise<ClientDictionary> {
		const snapshot: DataSnapshot = await get(DBService.dbWpClients())
		const clients: ClientDictionary = {}
		snapshot.forEach(data => {
			if (data.key) clients[data.key] = <WpClient>data.val()
		})
		return clients
	}

	/* istanbul ignore next */
	async getMessages(): Promise<Array<SettingsMessageInterface>> {
		const snapshot: QuerySnapshot<DocumentData> = await getDocs(FSService.mensajesCollection())
		const messages: Array<SettingsMessageInterface> = []
		snapshot.forEach((doc) => {
		const messageData = doc.data()
		const messageId = doc.id
		const message = {
			id: messageId,
			name: messageData.name,
			description: messageData.description,
			message: messageData.message,
			enabled: messageData.enabled
		}
		messages.push(message)
		})
		return messages
	}

	/* istanbul ignore next */
	async updateMessage(message: SettingsMessageInterface): Promise<void> {
		const messageRef: DocumentReference = doc(FSService.mensajesCollection(), message.id)
		const dataToUpdate = {
			name: message.name,
			description: message.description,
			message: message.message
		}
		await updateDoc(messageRef, dataToUpdate)
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
	enableWpNotifications(clientId: string, enable: boolean): Promise<void> {
		return set(ref(DBService.db, `settings/wp_clients/${clientId}/wpNotifications/`), enable);
	}

	/* istanbul ignore next */
	onWpNotifications(client: WpClient, listener: (enable: DataSnapshot) => void): void {
		onValue(query(ref(DBService.db, `wp_clients/${client.id}/wpNotifications`)), listener)
	}

	/* istanbul ignore next */
	offWpNotifications(client: WpClient): void {
		off(query(ref(DBService.db, `wp_clients/${client.id}/wpNotifications`)), 'value')
	}

	createClient(client: WpClient): Promise<void> {
		return set(ref(DBService.db, `settings/wp_clients/${client.id}/`), client)
	}

	deleteClient(client: WpClient): Promise<void> {
		return remove(ref(DBService.db, `settings/wp_clients/${client.id}/`))
	}
}
export default new WpClientRepository()