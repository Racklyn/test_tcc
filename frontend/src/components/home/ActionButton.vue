<script setup lang="ts">
    type Props = {
    icon: string
    disabled?: boolean
    }

    type Emits = {
    (e: 'click'): void
    }

    defineProps<Props>()
    defineEmits<Emits>()
</script>

<template>
    <v-btn
        :icon="icon"
        color="secondary"
        variant="flat"
        density="comfortable"
        rounded="lg"
        :disabled="disabled"
        @click.stop="$emit('click')"
        class="px-6 action-button"
    />
</template>

<style scoped>
    .action-button {
        transition: all 0.3s;
    }

    .action-button:hover {
        opacity: 0.85;
        box-shadow: 0 0px 6px #2a63ffe5;
    }
</style>