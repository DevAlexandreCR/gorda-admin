<template>
  <div class="container-fluid">
    <tabs></tabs>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import Tabs from '@/components/services/Tabs.vue'

@Options({
  components: {
    Tabs
  },
})

export default class Main extends Vue {
}
</script>
