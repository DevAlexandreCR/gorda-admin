<template>
<div class="row">
  
<SideBar></SideBar>
  
  
    <main class="main-content position-relative max-height-vh-100 h-100 mt-1 border-radius-lg ">
      <h1>Hola</h1>
<router-view></router-view>
    </main>
  </div>
  

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import SideBar from '@/components/SideBar.vue'; // @ is an alias to /src


@Options({
  components: {
    SideBar,
  },
})
export default class Home extends Vue {}
</script>
