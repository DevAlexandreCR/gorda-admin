<template>
  <SideBar></SideBar>
  <main class="main-content position-relative max-height-vh-100 h-100 mt-1 border-radius-lg ">
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import SideBar from '@/components/SideBar.vue';


@Options({
  components: {
    SideBar,
  },
})
export default class Dashboard extends Vue {
}
</script>
