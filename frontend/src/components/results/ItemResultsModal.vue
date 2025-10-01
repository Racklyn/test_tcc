<script setup lang="ts">
    import { computed, ref, watch } from 'vue'
    import type { ItemWithPostsAndResult } from '@/models/item'
    import { formatDateTime } from '@/utils/dateFormat'
    import { scoreToPercent } from '@/utils/commons'
    import ValueChip from './ValueChip.vue'
    import itemService from '@/services/itemService'
    import sentimentAnalyzerService from '@/services/sentimentAnalyzer/sentimentAnalyserService'

    type Props = {
        modelValue: boolean
        item_id?: number
    }

    type Emits = {
        (e: 'update:modelValue', value: boolean): void
        (e: 'itemUpdated', itemId: number, updates: Partial<ItemWithPostsAndResult>): void
        (e: 'itemResultUpdated'): void
    }

    const props = defineProps<Props>()

    const itemResult = ref<ItemWithPostsAndResult | undefined>()
    const isLoading = ref(true)
    const isUpdating = ref(false)

    const emit = defineEmits<Emits>()

    const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
    })

    const itemType = computed(() => {
        return itemResult.value?.type === 'product' ? 'PRODUTO' : 'SERVIÇO'
    })

    const itemTypeColor = computed(() => {
        return itemResult.value?.type === 'product' ? 'secondary-darken-1' : 'secondary'
    })

    const closeModal = () => {
        isOpen.value = false
    }

    const setBlockNameFromUpdates = async () => {
        if (!itemResult.value) return
        
        try {
            const response = await itemService.setBlockNameFromUpdates(
                itemResult.value.id, !itemResult.value.block_name_from_updates
            )

            if (response) {
                itemResult.value.block_name_from_updates = response.block_name_from_updates
                
                // Emitir evento para atualizar o item na ItemsView
                emit('itemUpdated', itemResult.value.id, {
                    block_name_from_updates: response.block_name_from_updates
                })
            }
        } catch (error) {
            console.error('Erro ao bloquear/desbloquear nome do item:', error)
        }
    }

    const runUpdateItemResult = async () => {
        if (!itemResult.value) {
            console.error('Item não encontrado')
            return
        }

        console.log('Atualizando item result...')
        isUpdating.value = true
        try {
            const response = await sentimentAnalyzerService.updateItem(
                itemResult.value.id.toString()
            )
            console.log('Resultado da atualização do item result:', response)
        } catch (error) {
            console.error('Erro ao atualizar item result:', error)
        } finally {
            isUpdating.value = false
            emit('itemResultUpdated')
            closeModal()
        }
    }

    const fetchItemResult = async () => {
        if (!props.item_id) return

        isLoading.value = true
        try {
            itemResult.value = await itemService.getWithPostsAndResult(props.item_id)
        } catch (error) {
            console.error('Erro ao buscar item result:', error)
        } finally {
            isLoading.value = false
        }
    }

    // Watcher para executar fetch quando o modal abrir ou item_id mudar
    watch(
        () => [props.modelValue, props.item_id],
        async ([isModalOpen, itemId]) => {
            if (isModalOpen && itemId) {
                await fetchItemResult()
            }
        },
        { immediate: true }
    )
</script>

<template>
  <v-dialog
    v-model="isOpen"
    max-width="700"
    :persistent="isUpdating"
  >
    <v-card
        class="item-results-modal text-font-primary py-2"
        :loading="isUpdating"
    >
        <div
            class="d-flex flex-column justify-center align-center"
            style="height: 200px;"
            v-if="isLoading"
        >
            <v-progress-circular indeterminate size="48" color="teal" />
            <p class="text-body-1 text-font-secondary-2 mt-4">
                Carregando resultados do item...
            </p>
        </div>

        <div v-else>
            <v-card-title class="text-font-primary d-flex align-center justify-center mx-6">
                <v-btn
                    icon="mdi-window-close"
                    :color="isUpdating ? 'grey-lighten-1' : 'font-secondary'"
                    variant="text"
                    rounded="lg"
                    class="position-absolute left-0 ml-3"
                    :readonly="isUpdating"
                    @click="closeModal"
                />
                <v-chip
                    :text="itemResult?.name"
                    :color="itemTypeColor"
                    variant="flat"
                    size="x-large"
                    rounded="lg"
                    class="font-weight-bold text-truncate"
                    :style="{ marginLeft: itemResult ? '48px' : '0px' }"
                />

                <v-btn
                    icon
                    variant="tonal"
                    density="compact"
                    rounded="lg"
                    class="ml-4"
                    v-if="itemResult"
                    :readonly="isUpdating"
                    @click="setBlockNameFromUpdates"
                >
                    <v-icon
                        color="font-secondary-2"
                        size="24"
                        :icon="itemResult.block_name_from_updates ? 'mdi-lock' : 'mdi-lock-open'"
                    />

                    <v-tooltip
                        :text="itemResult.block_name_from_updates
                            ? 'Nome do item BLOQUEADO (não sofrerá alterações nas atualizações). Clique para desbloquear.'
                            : 'Nome do item DESBLOQUEADO (pode sofrer alterações nas atualizações). Clique para bloquear.'
                        "
                        max-width="280"
                        open-delay="350"
                        activator="parent"
                        location="bottom"
                    />
                </v-btn>
            </v-card-title>

        <v-card-text
            v-if="itemResult"
            class="text-font-secondary"
             :class="{ 'opacity-50': isUpdating }"
        >
            <p
                class="font-weight-bold text-caption"
                :class="`text-${itemTypeColor}`"
            >
                {{ itemType }}
            </p>

            <p class="text-body-1 mb-3">
                {{ itemResult.description }}
            </p>

            <p class="text-body-1 mb-3">
                <strong>Última atualização:</strong> 
                {{ itemResult.last_sync ? formatDateTime(itemResult.last_sync) : '-' }}
            </p>

            <v-divider class="mb-1"/>

            <div class="d-flex align-center mb-5">
                <v-icon
                    color="font-secondary"
                    size="18"
                    class="mr-1"
                >
                    mdi-information-outline
                </v-icon>
                <p class="text-caption text-font-secondary">
                    Para as estatísticas, são considerados apenas os comentários que tratam especificamente desse {{itemType.toLowerCase()}}.
                </p>
            </div>

            <div class="d-flex justify-space-around mb-5">
                <ValueChip
                    :value="scoreToPercent(itemResult.item_average_score)"
                    text="Avaliação média"
                    size="md"
                    isPercent
                    style="width: 130px;"
                />
                <ValueChip
                    :value="itemResult.negatives_count ?? -1"
                    size="md"
                    text="Com. negativos"
                    style="width: 130px;"
                />
                <ValueChip
                    :value="itemResult.neutral_count ?? -1"
                    size="md"
                    text="Com. neutros"
                    style="width: 130px;"
                />
                <ValueChip
                    :value="itemResult.positives_count ?? -1"
                    size="md"
                    text="Com. positivos"
                    style="width: 130px;"
                />
                <ValueChip
                    :value="Math.round(itemResult.percentage_of_comments_related_to_item ?? -1)"
                    size="md"
                    text="Comentários que tratam sobre o item"
                    isPercent
                    style="width: 130px;"
                />
            </div>

            <v-divider />

            <h3 class="text-body-1 font-weight-bold mt-3 mb-2">RESUMO DAS OPINIÕES</h3>

            <p class="text-body-2 text-font-secondary bg-surface-card rounded-lg py-2 px-3">
                {{ itemResult.latest_analysis_result?.analysis_summary }}
            </p>

            <div class="d-flex ga-4 my-4 text-body-2">
                <span class="w-50 text-font-secondary bg-surface-positive rounded-lg py-2 px-3">
                    <h4 class="font-weight-bold mb-2 position-relative">
                        PONTOS POSITIVOS
                        <v-icon
                            color="font-secondary"
                            size="20"
                            class="position-absolute right-0 mr-1"
                        >
                            mdi-thumb-up
                        </v-icon>
                    </h4>

                    <p>{{ itemResult.latest_analysis_result?.positive_points }}</p>
                </span>

                <span class="w-50 text-font-secondary bg-surface-negative rounded-lg py-2 px-3">
                    <h4 class="font-weight-bold mb-2 position-relative">
                        PONTOS NEGATIVOS
                        <v-icon
                            color="font-secondary"
                            size="20"
                            class="position-absolute right-0 mr-1"
                        >
                            mdi-thumb-down
                        </v-icon>
                    </h4>

                    <p>{{ itemResult.latest_analysis_result?.negative_points }}</p>
                </span>
            </div>

            <div class="d-flex align-center mb-2">
                <v-icon
                    color=" text-font-secondary"
                    size="24"
                    class="mr-1"
                >
                    mdi-note-text-outline
                </v-icon>
        
                <p class="text-body-2 text-font-secondary">
                    <strong>
                        {{ itemResult.posts_count ?? 0 }} 
                        {{`${(itemResult.posts_count ?? 0) > 1 ? 'publicações' : 'publicação'}`}}
                    </strong>
                    {{`${(itemResult.posts_count ?? 0) > 1 ? 'tratam' : 'trata'}`}}
                    sobre este {{ itemType.toLowerCase() }} 
                    (total de 
                    <strong>
                        {{ itemResult.posts?.reduce((acc, post) => acc + (post.comments_count ?? 0), 0)}}
                    </strong>
                    comentários):
                </p>
            </div>

            <div class="d-flex flex-column">
                <div
                    v-for="post in itemResult.posts"
                    class="d-flex align-center justify-space-between mb-2"
                >
                    <v-chip
                        :text="formatDateTime(post.post_date)"
                        color="primary-darken-1"
                        variant="flat"
                        density="comfortable"
                        rounded="lg"
                        class="font-weight-bold text-caption justify-center"
                    />

                    <span class="d-flex align-center">
                        <v-icon
                            color="text-font-secondary"
                            size="20"
                            class="mr-1"
                        >
                            mdi-comment-processing-outline
                        </v-icon>

                        <p
                            class="text-body-2 font-weight-bold text-font-secondary"
                            style="width: 28px;"
                        >
                            {{ post.comments_count ?? 0 }}
                        </p>
                    </span>

                    <ValueChip
                        :value="scoreToPercent(post.average_score)"
                        size="sm"
                        isPercent
                    />

                    <v-btn
                        class=" rounded-lg"
                        variant="tonal"
                        density="comfortable"
                        append-icon="mdi-open-in-new"
                        :readonly="isUpdating"
                    >
                        "
                        <p
                            class="text-caption text-font-secondary text-truncate"
                            style="width: 300px;"
                        > {{ post.content }} </p>
                        "
                    </v-btn>
                </div>
            </div>

        </v-card-text>

        <v-card-actions
            v-if="itemResult"
            class="pa-6 pt-2"
        >

            <p
                v-if="isUpdating"
                class="d-flex align-center text-body-2 text-primary-darken-1 font-weight-bold"
            >
                <v-progress-circular
                    indeterminate
                    size="18"
                    width="2"
                    color="teal"
                    class="mr-2"
                />
                Atualizando resultados do {{ itemType.toLowerCase() }}. Aguarde...
            </p>

            <p
                v-else-if="itemResult.outdated"
                class="text-body-2 text-font-secondary"
            >
                <span class="text-error-light">ITEM DESATUALIZADO!</span> Clique para atualizar
            </p>

            <p
                v-else
                class="text-body-2 text-font-secondary"
            >
                Informações do item <span class="text-success">ATUALIZADAS</span> com todos os posts
            </p>

            <v-spacer></v-spacer>
            <v-btn
                :disabled="!itemResult.outdated || isUpdating"
                :loading="isUpdating"
                variant="flat"
                density="comfortable"
                color="primary"
                size="large"
                rounded="lg"
                append-icon="mdi-sync"
                class="font-weight-bold text-body-1 px-6"
                style="color: white !important;"
                @click="runUpdateItemResult"
            >
                Atualizar
            </v-btn>
        </v-card-actions>


            <v-card-text class="mt-5" v-if="!itemResult">    
                <p class="text-body text-center font-weight-bold text-font-primary">Falha ao carregar os dados do item selecionado!</p>
                <p class="text-body text-font-secondary">
                    Se o problema persistir com esse item, tente executar a "Análise de Sentimentos" novamente para essa marca.
                </p>
            </v-card-text>

        </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
    .item-results-modal {
        border-radius: 16px !important;
    }

    .v-btn:disabled {
        background-color: #6b6b6b !important;
        color: #ffffff !important;
        opacity: 0.6 !important;
    }

</style>
