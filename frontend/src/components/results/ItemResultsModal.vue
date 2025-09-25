<script setup lang="ts">
    import { computed } from 'vue'
    import type { Item } from '@/models/item'
    import { formatDateTime } from '@/utils/dateFormat'
    import { scoreToPercent } from '@/utils/commons'
    import ValueChip from './ValueChip.vue'

    type Props = {
        modelValue: boolean
        item?: Item
    }

    type Emits = {
        (e: 'update:modelValue', value: boolean): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
    })

    const itemType = computed(() => {
        return props.item?.type === 'product' ? 'PRODUTO' : 'SERVIÇO'
    })

    const itemTypeColor = computed(() => {
        return props.item?.type === 'product' ? 'secondary-darken-1' : 'secondary'
    })

    const closeModal = () => {
        isOpen.value = false
    }
</script>

<template>
  <v-dialog
    v-model="isOpen"
    max-width="700"
  >
    <v-card
        class="item-results-modal text-font-primary py-2"
        v-if="item"
    >
        <v-card-title class="text-font-primary d-flex align-center justify-center mx-6">
            <v-btn
                icon="mdi-window-close"
                color="font-secondary"
                variant="text"
                rounded="lg"
                class="position-absolute left-0 ml-3"
                @click="closeModal"
            />
            <v-chip
                :text="item.name"
                :color="itemTypeColor"
                variant="flat"
                size="x-large"
                rounded="lg"
                class="font-weight-bold text-truncate"
                :style="{ marginLeft: '48px' }"
            />

            <v-btn
                icon
                variant="tonal"
                density="compact"
                rounded="lg"
                class="ml-4"
            >
                <v-icon
                    color="font-secondary-2"
                    size="24"
                    :icon="item.block_name_from_updates ? 'mdi-lock' : 'mdi-lock-open'"
                />

                <v-tooltip
                    :text="item.block_name_from_updates
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

      <v-card-text class="text-font-secondary">
        <p
            class="font-weight-bold text-caption"
            :class="`text-${itemTypeColor}`"
        >
            {{ itemType }}
        </p>

        <p class="text-body-1 mb-3">
            {{ item.description }}
        </p>

        <p class="text-body-1 mb-3">
            <strong>Última atualização:</strong> 
            {{ item.last_sync ? formatDateTime(item.last_sync) : '-' }}
        </p>

        <v-divider class="mb-6" />

        <div class="d-flex justify-space-around ga-2">
            <ValueChip
                :value="scoreToPercent(item?.item_average_score)"
                text="Avaliação média"
                size="md"
                isPercent
            />
            <ValueChip
                :value="-1"
                size="md"
                text="Outro valor qualquer"
                isPercent
            />
            <ValueChip
                :value="200"
                size="md"
                text="Outro valor qualquer"
            />
            <ValueChip
                :value="10"
                size="md"
                text="Algum valor"
            />
            <ValueChip
                :value="50"
                size="md"
                text="Algum valor"
            />
        </div>


        <h3 class="text-body-1 font-weight-bold mt-4 mb-2">RESUMO DAS OPINIÕES</h3>

        <p class="text-body-2 text-font-secondary bg-surface-card rounded-lg py-2 px-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
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

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
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

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                    
                </p>
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
                    {{ item.posts_count ?? 0 }} 
                    {{`${(item.posts_count ?? 0) > 1 ? 'publicações' : 'publicação'}`}}
                </strong>
                {{`${(item.posts_count ?? 0) > 1 ? 'tratam' : 'trata'}`}}
                sobre este {{ itemType.toLowerCase() }}:
            </p>
        </div>

        <div class="d-flex flex-column">
            <div
                v-for="post in [1,2,3]"
                class="d-flex align-center justify-space-between mb-2"
            >
                <v-chip
                    text="dd/mm/yyyy 00h00"
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
                        ?
                    </p>
                </span>

                <ValueChip
                    :value="80"
                    size="sm"
                    isPercent
                />

                <v-btn
                    class=" rounded-lg"
                    variant="tonal"
                    density="comfortable"
                    append-icon="mdi-open-in-new"
                >
                    "
                    <p
                        class="text-caption text-font-secondary text-truncate"
                        style="width: 300px;"
                    >
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis iusto inventore voluptatum mollitia delectus harum nulla fugiat ab unde, enim, fugit necessitatibus quam neque architecto! Fugit necessitatibus recusandae nulla esse!"
                    </p>
                    "
                </v-btn>
            </div>
        </div>

      </v-card-text>

      <v-card-actions class="pa-6 pt-2">
        <p
            v-if="item.outdated"
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
            :disabled="!item.outdated"
            variant="flat"
            density="comfortable"
            color="primary"
            size="large"
            rounded="lg"
            append-icon="mdi-sync"
            class="font-weight-bold text-body-1 px-6"
            style="color: white !important;"
            @click=""
        >
            Atualizar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
        v-else
        class="item-results-modal text-font-primary py-2"
    >
        <v-card-title class="text-font-primary d-flex align-center justify-center mx-6">
            <p>Falha ao carregar os dados do item selecionado!</p>
        </v-card-title>
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
