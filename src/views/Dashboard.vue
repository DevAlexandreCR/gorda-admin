<template>
  <SideBar></SideBar>
  <main class="bg-dark main-content position-relative  border-radius-lg">
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
