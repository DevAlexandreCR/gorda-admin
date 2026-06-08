<template>
  <span
    v-if="count != null && count > 0"
    class="badge rounded-pill bg-info ms-1"
    style="font-size: 0.65rem; font-weight: 600; vertical-align: middle;"
    :title="`${count} completed`"
  >{{ count }}</span>
</template>

<script setup lang="ts">
interface Props {
  count?: number | null
}

defineProps<Props>()
</script>
