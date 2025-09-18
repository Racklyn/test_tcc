<script setup lang="ts">
    import type { Brand } from '@/models/brand'
    import PageChip from '../PageChip.vue'
    import ActionButton from './ActionButton.vue'

    type Props = {
        brand: Brand
    }

    interface Emits {
        (e: 'click'): void
        (e: 'edit', brand: Brand): void
        (e: 'delete', brand: Brand): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const deleteBrand = () => {
        emit('delete', props.brand)
    }

    const editBrand = () => {
        emit('edit', props.brand)
    }
</script>

<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card 
            v-bind="props"
            class="pa-2 border border-black brand-card"
            :elevation="isHovering ? 8 : 0"
            flat
            color="surface-card"
            @click="$emit('click')"
        >
        <v-card-title class="text-font-primary d-flex align-center">
            <v-avatar 
                size="56" 
                class="mr-3 border"
                color="white"
            >
                <slot name="icon">
                    <v-icon color="primary-darken-1">mdi-panorama</v-icon>
                </slot>
            </v-avatar>
            <h4>{{ brand.name }}</h4>
        </v-card-title>

        <v-card-text class="text-font-secondary">
            <p class="mb-4 text-truncate">{{ brand.about }}</p>

            <p class="mb-1">Páginas:</p>
            <div class="mb-4 d-flex">
                <PageChip
                    v-for="value in brand.pages"
                    :key="value.id"
                    class="mr-2"
                    :text="value.title"
                />
            </div>

            <p>Última atualização: <strong>00h00 de 00/00/2025</strong></p>
        </v-card-text>

        <v-card-actions class="mx-2">
            <v-spacer></v-spacer>
            <ActionButton icon="mdi-trash-can" @click="deleteBrand"  />
            <ActionButton icon="mdi-pencil-box-outline" @click="editBrand" />
        </v-card-actions>
        </v-card>
    </v-hover>
</template>

<style scoped>
    .brand-card {
        width: 380px;
        border-radius: 16px;
    }
</style>