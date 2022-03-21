<template>
  <div>
    <SideBar ></SideBar>
    <main  class="main-content mt-1 border-radius-lg " id="main">
      <NavBar/>
      <router-view class="mt-4 ms-2"></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'

@Options({
  components: {
    SideBar,
    NavBar
  },
})
export default class Dashboard extends Vue {
  mounted(): void {
    require('@/vendor/js/soft-ui-dashboard')
  }
}
</script>
