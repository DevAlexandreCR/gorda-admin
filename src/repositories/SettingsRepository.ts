import DBService from '@/services/DBService'
import {DataSnapshot, get, off, onValue, query, ref, remove, set} from 'firebase/database'
import { WpClient } from '@/types/WpClient'
import { RideFeeInterface } from '@/types/RideFeeInterface'
import {ClientDictionary} from "@/types/ClientDiccionary";
import { SettingsMessageInterface } from '@/types/SettingsMessagesInterface';
import { DocumentData, DocumentReference, QuerySnapshot, doc, getDocs, updateDoc } from 'firebase/firestore';
import FSService from '@/services/FSService';
import {MessagesEnum} from '@/constants/MessagesEnum'
import {Branch} from "@/types/Branch";

class SettingsRepository {

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
		const snapshot: QuerySnapshot<DocumentData> = await getDocs(FSService.messagesCollection())
		const messages: Array<SettingsMessageInterface> = []
		snapshot.forEach((doc) => {
		const messageData = doc.data()
		const messageId = doc.id as MessagesEnum
		const message = {
			id: messageId,
			name: messageData.name,
			description: messageData.description,
			message: messageData.message,
			enabled: messageData.enabled,
			interactive: messageData.interactive || null
		}
		messages.push(message)
		})
		return messages
	}

	/* istanbul ignore next */
	async updateMessage(message: SettingsMessageInterface): Promise<void> {
		const messageRef: DocumentReference = doc(FSService.messagesCollection(), message.id)
		if (message.interactive && message.interactive.type === 'location_request_message') {
			message.interactive.action = {
			name: 'send_location'
			}
		}
		const dataToUpdate = {
			name: message.name,
			description: message.description,
			message: message.message,
			enabled: message.enabled,
			interactive: message.interactive
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
	async getBranches(): Promise<Map<string, Branch>> {
		const snapshot: DataSnapshot = await get(ref(DBService.db, 'settings/branches'))
		return <Map<string, Branch>>snapshot.val()
	}

	/* istanbul ignore next */
	enableWpNotifications(clientId: string, enable: boolean): Promise<void> {
		return set(ref(DBService.db, `settings/wp_clients/${clientId}/wpNotifications/`), enable);
	}

	/* istanbul ignore next */
	enableChatBot(clientId: string, enable: boolean): Promise<void> {
		return set(ref(DBService.db, `settings/wp_clients/${clientId}/chatBot/`), enable);
	}

	/* istanbul ignore next */
	enableAssistant(clientId: string, enable: boolean): Promise<void> {
		return set(ref(DBService.db, `settings/wp_clients/${clientId}/assistant/`), enable);
	}

	/* istanbul ignore next */
	onWpNotifications(client: WpClient, listener: (enable: DataSnapshot) => void): void {
		onValue(query(ref(DBService.db, `wp_clients/${client.id}/wpNotifications`)), listener)
	}

	/* istanbul ignore next */
	offWpNotifications(client: WpClient): void {
		off(query(ref(DBService.db, `wp_clients/${client.id}/wpNotifications`)), 'value')
	}

	/* istanbul ignore next */
	createClient(client: WpClient): Promise<void> {
		return set(ref(DBService.db, `settings/wp_clients/${client.id}/`), client)
	}

	/* istanbul ignore next */
	deleteClient(client: WpClient): Promise<void> {
		return remove(ref(DBService.db, `settings/wp_clients/${client.id}/`))
	}

	/* istanbul ignore next */
	async setPercentage(branchId: string, cityId: string, percentage: number): Promise<void> {
		await set(ref(DBService.db, `settings/branches/${branchId}/cities/${cityId}/percentage`), percentage)
	}

}
export default new SettingsRepository()