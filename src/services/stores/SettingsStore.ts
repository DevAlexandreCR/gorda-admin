import {defineStore} from "pinia";
import {Branch} from "@/types/Branch";
import SettingsRepository from "@/repositories/SettingsRepository";
import {City} from "@/types/City";

export const useSettingsStore = defineStore('generalSettingsStore', {
    state: () => {
        return {
            branches: [] as Branch[],
            branchSelected: null as City | null
        }
    },
    actions: {
        async getBranches(): Promise<void> {
            this.branchSelected = JSON.parse(sessionStorage.getItem('branchSelected')) as City | null
            this.branches = await SettingsRepository.getBranches().catch(() => [])
            if (this.branches.length === 1 && this.branchSelected === null) {
                this.setBranchSelected(this.branches[0].cities[0])
            }
        },
        setBranchSelected(city: City): void {
            this.branchSelected = city
            sessionStorage.setItem('branchSelected', JSON.stringify(this.branchSelected))
        }
    }
})