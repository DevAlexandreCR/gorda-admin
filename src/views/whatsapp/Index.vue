<template>
  <div>
    <div class="row container-fluid">
      <div class="col-sm-6 mt-2" v-for="client in clients" :key="client.id">
        <Connection :client="client"></Connection>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useWpClientsStore} from "@/services/stores/WpClientStore";
import Connection from "@/views/Connection.vue";
import {storeToRefs} from "pinia";

const {clients} = storeToRefs(useWpClientsStore())
</script>