import {defineStore} from "pinia";
import {Branch} from "@/types/Branch";
import SettingsRepository from "@/repositories/SettingsRepository";

export const useSettingsStore = defineStore('generalSettingsStore', {
    state: () => {
        return {
            branches: [] as Branch[]
        }
    },
    actions: {
        async getBranches(): Promise<void> {
            this.branches = await SettingsRepository.getBranches().catch(() => [])
        }
    }
})