<script setup lang="ts">
    type Props = {
        text: string
    }

    defineProps<Props>()
</script>

<template>
  <v-chip
    :text="text"
    color="primary-darken-1"
    variant="flat"
    density="comfortable"
    rounded="lg"
  />
</template>

<style scoped>
</style>
