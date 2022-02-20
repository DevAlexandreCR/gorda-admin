<template class="py4">
  <create-service></create-service>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import CreateService from '@/components/services/CreateService.vue'

@Options({
  components: {
    CreateService,
  },
})

export default class Main extends Vue {
}
</script>
