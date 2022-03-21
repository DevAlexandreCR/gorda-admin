<template>
  <div>
    <router-view/>
  </div>
</template>
<script lang="ts">
import {Vue} from 'vue-class-component'
import AuthService from '@/services/AuthService'

export default class App extends Vue {
  mounted(): void {
    AuthService.onAuthStateChanged(location.pathname)
  }
}
</script>

<style lang="scss">
@import "src/assets/scss/app.scss";
</style>
