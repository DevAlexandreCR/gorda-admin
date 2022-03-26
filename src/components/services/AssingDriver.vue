<template>
<!-- Modal -->
<div class="modal fade" id="drivermodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="AssingModalLabel">Services</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
       <AutoComplete :elements="VehicleInterface"/>
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
import DriverInterface from '@/entities/DriverInterface'
import DriverRepository from '@/repositories/DriverRepository'

@Options({
  components: {
    AutoComplete,
    Field
  }
})

export default class AssingDriver extends Vue {
  VehicleInterface: Array<any> = []
  serviceId: string

  mounted():  void {

  var drivermodal = document.getElementById('drivermodal')
    drivermodal?.addEventListener('show.bs.modal', event  => {
      this.serviceId = event.relatedTarget.id
         console.log(this.serviceId)
    const vehicle = DriverRepository
      DriverInterface.forEach(vehicle => {
        console.log(this.serviceId)
      this.VehicleInterface.push(vehicle)
      console.log(this.VehicleInterface)
    })
    })
  }
}



</script>
