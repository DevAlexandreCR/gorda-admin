import {defineStore} from "pinia";
import {Branch} from "@/types/Branch";
import SettingsRepository from "@/repositories/SettingsRepository";
import {City} from "@/types/City";
import {BranchSelected} from "@/types/BranchSelected";
import { RideFeeInterface } from "@/types/RideFeeInterface";

export const useSettingsStore = defineStore('generalSettingsStore', {
    state: () => {
        return {
            branches: [] as Branch[],
            branchSelected: null as BranchSelected | null,
            rideFees: null as RideFeeInterface | null 
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
            this.branches = await SettingsRepository.getBranches().catch(() => [] as Branch[])
            const selectedBranch = this.findSelectedBranch()

            if (selectedBranch && this.branchSelected?.city?.id) {
                const selectedCity = selectedBranch.cities.find((city) => city.id === this.branchSelected?.city.id)
                if (selectedCity) {
                    this.setBranchSelected(selectedBranch, selectedCity)
                    return
                }
            }

            if (this.branches.length === 1 && this.branchSelected === null) {
                const branch = this.branches[0]
                const city = branch?.cities[0]
                if (branch && city) {
                    this.setBranchSelected(branch, city)
                }
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
        findSelectedBranch(): Branch | null {
            if (!this.branchSelected) {
                return null
            }

            return this.branches.find((branch) => branch.id === this.branchSelected?.id) ?? null
        },

        async setPercentage(branchId: string, city: City): Promise<void> {
            await SettingsRepository.setPercentage(branchId, city.id, city.percentage)
            await this.getBranches()
        },

        async getRideFees(): Promise<void> {
            this.rideFees = await SettingsRepository.getRideFees()
        }
    }
})
