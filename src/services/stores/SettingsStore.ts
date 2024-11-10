import {defineStore} from "pinia";
import {Branch} from "@/types/Branch";
import SettingsRepository from "@/repositories/SettingsRepository";
import {City} from "@/types/City";
import {BranchSelected} from "@/types/BranchSelected";

export const useSettingsStore = defineStore('generalSettingsStore', {
    state: () => {
        return {
            branches: new Map<string, Branch>() as Map<string, Branch>,
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
            this.branches = await SettingsRepository.getBranches().catch(() => new Map<string, Branch>())
            if (this.branches.size === 1 && this.branchSelected === null) {
                this.branches.forEach((branch: Branch) => {
                    branch.cities.forEach((city: City) => {
                        this.setBranchSelected(branch, city)
                        return
                    })
                 })
            }
        },
        setBranchSelected(branch: Branch, city: City): void {
            this.branchSelected = {
                id: branch.id,
                calling_code: branch.calling_code,
                country: branch.country,
                currency_code: branch.currency_code,
                city: city
            }
            sessionStorage.setItem('branchSelected', JSON.stringify(this.branchSelected))
        },

        async setPercentage(branchId: string, city: City): Promise<void> {
            await SettingsRepository.setPercentage(branchId, city.id, city.percentage)
            await this.getBranches()
        }
    }
})