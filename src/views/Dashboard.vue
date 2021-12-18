<template>
  <SideBar></SideBar>
  <main class="main-content position-relative max-height-vh-100 h-100 mt-1 border-radius-lg " id="main">
    <NavBar/>
    <router-view></router-view>
  </main>
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
  collapsed = false

  mounted(): void {
    require('@/vendor/js/soft-ui-dashboard')
  }
}
</script>
