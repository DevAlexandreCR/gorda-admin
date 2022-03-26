<template>
  <!-- Modal -->
  <div class="modal fade" id="driverModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="AssignModalLabel">Services</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <AutoComplete :elements="plates"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {Vue, Options} from 'vue-class-component'
import {Field} from 'vee-validate'
import AutoComplete from '@/components/AutoComplete.vue'
import DriverRepository from '@/repositories/DriverRepository'
import {DriverInterface} from "@/entities/DriverInterface";

@Options({
  components: {
    AutoComplete,
    Field
  }
})

export default class AssignDriver extends Vue {
  plates: Array<string> = []
  serviceId: string

  mounted(): void {
    const driverModal = document.getElementById('driverModal');
    driverModal?.addEventListener('show.bs.modal', (event: any) => {
      this.serviceId = event.relatedTarget.id
      console.log(this.serviceId)
      DriverRepository.getAll().then(drivers => {
        Object.values(drivers).forEach(driver => {
          console.log(driver)
          this.plates.push(driver.vehicle.plate)
          console.log(this.plates)
        })
      })
    })
  }
}


</script>
