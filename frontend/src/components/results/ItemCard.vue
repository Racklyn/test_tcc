<script setup lang="ts">
    import { computed } from 'vue'
    import { formatDateTime } from '@/utils/dateFormat'
    import ValueChip from './ValueChip.vue'
    import { scoreToPercent } from '@/utils/commons'
    import type { Item } from '@/models/item'

    type Props = {
        item: Item
    }

    const props = defineProps<Props>()

    const emit = defineEmits<{
        (e: 'click'): void
    }>()

    const itemType = computed(() => {
        return props.item.type === 'product' ? 'PRODUTO' : 'SERVIÇO'
    })

    const itemTypeColor = computed(() => {
        return props.item.type === 'product' ? 'secondary-darken-1' : 'secondary'
    })

</script>

<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card 
            v-bind="props"
            class="pa-2 border border-black post-card"
            :elevation="isHovering ? 8 : 0"
            flat
            color="surface-card"
            @click="emit('click')"
        >
            <v-card-title class="text-font-primary d-flex align-center justify-center mb-3">
                <v-chip
                    :text="item.name"
                    :color="itemTypeColor"
                    variant="flat"
                    rounded="lg"
                    class="font-weight-bold text-truncate"
                    :style="{ marginLeft: item.block_name_from_updates ? '22px' : '0px' }"
                />
                <v-icon
                    v-if="item.block_name_from_updates"
                    color="font-secondary-2"
                    size="14"
                    icon="mdi-lock"
                    class="ml-2"
                />
            </v-card-title>

            <v-card-text class="text-font-secondary">
                <v-tooltip
                    :text="item.description"
                    open-delay="350"
                    max-width="360"
                    location="top"
                >
                    <template #activator="{ props }">
                        <p
                            v-bind="props"
                            class="text-body-1 mb-6  three-lines text-wrap"
                        >
                            {{ item.description }}
                        </p>
                    </template>
                </v-tooltip>

                <div style="height: 60px;">
                    <p class="text-body-2">
                        Última atualização: 
                        <strong>{{ item.last_sync ? formatDateTime(item.last_sync) : '-' }}</strong>
                    </p>
            
                    <span v-if="item.outdated" class="d-flex align-center">
                        <v-icon
                            color="error-light"
                            size="24"
                            class="mr-2"
                        >
                            mdi-sync-alert
                        </v-icon>

                        <p
                            class="text-caption font-weight-bold text-error-light"
                        >
                            Item desatualizado
                        </p>
                    </span>
                </div>

                <div class="d-flex align-center">
                    <ValueChip
                        :value="scoreToPercent(item.item_average_score)"
                        size="sm"
                        class="mr-6"
                        isPercent
                    />

                    <v-icon
                        color=" text-font-secondary-2"
                        size="24"
                        class="mr-1"
                    >
                        mdi-note-text-outline
                    </v-icon>

                    <p
                        class="text-body-2 font-weight-bold text-font-secondary-2"
                    >{{ item.posts_count ?? 0 }} {{`${(item.posts_count ?? 0) > 1 ? 'posts' : 'post'}`}}</p>

                    <v-spacer />

                    <p
                        class="font-weight-bold text-caption pt-0"
                        :class="`text-${itemTypeColor}`"
                    >
                        {{ itemType }}
                    </p>
                </div>
            </v-card-text>
        </v-card>
    </v-hover>
</template>

<style scoped>
    .post-card {
        width: 380px;
        border-radius: 16px;
    }

    .word-spacing {
        word-spacing: 10px;
    }

    .three-lines {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.4;
        height: calc(1.4em * 3);
    }
</style>