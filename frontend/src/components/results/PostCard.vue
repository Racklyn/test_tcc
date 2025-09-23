<script setup lang="ts">
    import { computed } from 'vue';
    import type { PostWithItem } from '@/models/post';
    import { formatDateTime } from '@/utils/dateFormat';
    import PercentChip from './PercentChip.vue';

    type Props = {
        post: PostWithItem
    }

    const props = defineProps<Props>()

    const postDate = computed(() => {
        return formatDateTime(props.post.post_date)
    })

    const updatedAt = computed(() => {
        return formatDateTime(props.post.updated_date)
    })

    const lastAnalysis = computed(() => {
        if (!props.post.last_analysis) return null
        return formatDateTime(props.post.last_analysis)
    })

    const itemType = computed(() => {
        return props.post.item.type === 'product' ? 'PRODUTO' : 'SERVIÇO'
    })

    const itemTypeColor = computed(() => {
        return props.post.item.type === 'product' ? 'secondary-darken-1' : 'secondary'
    })

    const scoreToPercent = (score: number | undefined) => {
        if (!score) return -1
        return Math.round((score)*100)
    }

</script>

<template>
    <v-card 
        class="pa-2 border border-black post-card"
        flat
        color="surface-card"
    >
    <v-card-title class="text-font-primary d-flex align-center mb-1">
        <h4 class="word-spacing">
            {{ postDate }}
        </h4>
        <v-spacer />

        <v-tooltip
            text="Ver publicação no Facebook (indisponível)"
            location="top"
            open-delay="350"
            width="240"
        >
            <template #activator="{ props }">
                <v-btn
                    v-bind="props"
                    icon="mdi-open-in-new"
                    color="primary-darken-1"
                    variant="tonal"
                    density="comfortable"
                    rounded="lg"
                />
            </template>
        </v-tooltip>
    </v-card-title>

    <v-card-text class="text-font-secondary">
        <v-tooltip
            :text="post.content"
            open-delay="350"
            max-width="360"
            location="top"
        >
            <template #activator="{ props }">
                <p
                    v-bind="props"
                    class="text-body-1 mb-8 three-lines text-wrap"
                >
                    {{ post.content }}
                </p>
            </template>
        </v-tooltip>


        <div class="mb-2 mb-lg-4" style="height: 40px;">
            <div
                class="d-flex align-center"
                v-if="props.post.item"
            >
                <v-chip
                    :text="itemType"
                    :color="itemTypeColor"
                    variant="flat"
                    density="compact"
                    rounded="lg"
                    class="font-weight-bold text-caption justify-center mr-3"
                    style="width: 110px;"
                />
    
                <p class="text-subtitle-1 text-truncate">{{ props.post.item.name }}</p>
            </div>
            <p
                class="text-body-2 text-font-light-1"
                style="height: 40px;"
                v-else
            >
                NENHUM ITEM ASSOCIADO (execute a análise de sentimentos)
            </p>
        </div>


        <div class="d-flex align-start justify-space-between flex-column flex-lg-row align-lg-end flex-lg-row-reverse">
            <span class="d-flex align-end mb-6 mb-lg-0">
                <span class="d-flex flex-column align-lg-center mr-4 mb-lg-0">
                    <p class="text-caption pl-1 pl-lg-0">Atualizado em:</p>
                    <v-chip
                        :text="updatedAt"
                        color="scraper-color"
                        variant="outlined"
                        density="comfortable"
                        class="font-weight-bold text-caption justify-center date-chip"
                    />
                </span>

                <span class="d-flex flex-column align-lg-center">
                    <p class="text-caption  pl-1 pl-lg-0">Análise de sentimentos em:</p>
                    <v-chip
                        :text="lastAnalysis ?? 'Não realizada'"
                        :color="lastAnalysis ? 'analysis-color' : 'font-light-1'"
                        variant="outlined"
                        density="comfortable"
                        class="font-weight-bold text-caption justify-center date-chip"
                    />
                </span>
            </span>

            <span class="d-flex align-center">
                <PercentChip
                    :value="scoreToPercent(post.average_score)"
                    size="sm"
                    class="mr-4"
                />

                <span class="d-flex align-center">
                    <v-icon
                        color=" text-font-secondary-2"
                        size="24"
                        class="mr-1"
                    >
                        mdi-comment-processing-outline
                    </v-icon>

                    <p
                        class="text-body-2 font-weight-bold text-font-secondary-2"
                    >{{ post.comments_count }} comentários</p>
                </span>
            </span>
        </div>
    </v-card-text>
    </v-card>
</template>

<style scoped>
    .post-card {
        width: 570px;
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

    .date-chip {
        width: 130px;
        border-width: 2px;
        border-radius: 12px;
    }
</style>