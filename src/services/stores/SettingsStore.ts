import {defineStore} from "pinia";
import {Branch} from "@/types/Branch";
import SettingsRepository from "@/repositories/SettingsRepository";
import {City} from "@/types/City";
import {BranchSelected} from "@/types/BranchSelected";

export const useSettingsStore = defineStore('generalSettingsStore', {
    state: () => {
        return {
            branches: [] as Branch[],
            branchSelected: null as BranchSelected | null
        }
    },
    actions: {
        async getBranches(): Promise<void> {
            const storedBranch = sessionStorage.getItem('branchSelected')
            if (storedBranch !== null) {
                this.branchSelected = JSON.parse(storedBranch) as BranchSelected
            } else {
                this.branchSelected = null
            }
            this.branches = await SettingsRepository.getBranches().catch(() => [])
            if (this.branches.length === 1 && this.branchSelected === null) {
                this.setBranchSelected(this.branches[0], this.branches[0].cities[0])
            }
        },
        setBranchSelected(branch: Branch, city: City): void {
            this.branchSelected = {
                calling_code: branch.calling_code,
                country: branch.country,
                currency_code: branch.currency_code,
                city: city
            }
            sessionStorage.setItem('branchSelected', JSON.stringify(this.branchSelected))
        }
    }
})