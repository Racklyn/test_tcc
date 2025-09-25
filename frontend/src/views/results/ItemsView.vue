<script setup lang="ts">
    import { computed, inject, ref, type Ref } from 'vue'
    import SearchBarFilter from '@/components/SearchBarFilter.vue'
    import type { BrandWithItemsAndStatistics } from '@/models/brand'
    import ItemCard from '@/components/results/ItemCard.vue'
    import DefaultDialog from '@/components/DefaultDialog.vue'
    import ItemResultsModal from '@/components/results/ItemResultsModal.vue'
    import type { Item } from '@/models/item'

    // Injetar o brand fornecido pela ResultsView
    const selectedBrand = inject<Ref<BrandWithItemsAndStatistics | null>>('selectedBrand')

    const items = computed(() => {
        return selectedBrand?.value?.items ?? []
    })

    const productsCount = computed(() => {
        return items.value.filter((item) => item.type === 'product').length
    })

    const servicesCount = computed(() => {
        return items.value.filter((item) => item.type === 'service').length
    })

    const outdatedCount = ref(3) //TODO: remover esse ref e usar o computed
    // const outdatedCount = computed(() => {
    //     return items.value.filter((item) => item.outdated).length
    // })

    const showDialog = ref(false)

    const selectedItem = ref<Item | undefined>()
    const showItemResultsModal = ref(false)

    const openItemResultsModal = (item: Item) => {
        selectedItem.value = item
        showItemResultsModal.value = true
    }

    // Função para abrir o dialog
    const openUpdateDialog = () => {
        if (outdatedCount.value > 0) {
            showDialog.value = true
        }
    }

    // Função para atualizar todos os itens
    const handleUpdateAll = () => {
        // TODO: Implementar lógica de atualização
        console.log('Atualizando todos os itens desatualizados...')
        showDialog.value = false
    }
</script>

<template>
    <div style="padding-bottom: 150px;">
        <SearchBarFilter />
    
        <p class="text-body-1 font-weight-bold my-3 ml-4">
            <span class="text-secondary-darken-1 mr-3">
                {{ productsCount }} produtos
            </span>
            <span class="text-secondary">
                {{ servicesCount }} serviços
            </span>
        </p>
    
    
        <v-row>
            <v-col
                v-if="items.length > 0"
                v-for="item in items" :key="item.id"
                class="d-flex justify-space-around mb-4"
                cols="6"
                lg="4"
            >
                <ItemCard :item="item" @click="openItemResultsModal(item)" />
            </v-col>
    
            <v-col v-else cols="12" class="d-flex flex-column justify-center align-center mt-12">
                <v-icon size="64" color="grey-lighten-1">mdi-package-variant</v-icon>
                <h3 class="text-h5 text-grey-lighten-1 mt-4">Nenhum produto ou serviço identificado</h3>
                <p class="text-body-1 text-grey-lighten-1 mt-6">
                    Execute a análise de sentimentos na aba "PUBLICAÇÕES" para identificar produtos e serviços com base nas publicações existentes
                </p>
            </v-col>
        </v-row>
    
        <div class="position-fixed bottom-0 right-0 mr-12 mb-12">
            <v-badge
                location="top left"
                :color="outdatedCount > 0 ? 'error-light' : 'primary-darken-1'"
                :content="outdatedCount"
                offset-x="3"
            >
                <v-btn
                    :disabled="outdatedCount === 0"
                    variant="flat"
                    color="primary"
                    size="large"
                    rounded="lg"
                    append-icon="mdi-sync"
                    class="font-weight-bold text-body-1"
                    style="color: white !important;"
                    @click="openUpdateDialog"
                >
                    Atualizar todos
                </v-btn>

                <v-tooltip
                    v-if="outdatedCount === 0"
                    text="Nenhum item necessita de atualização"
                    activator="parent"
                />
            </v-badge>
        </div>
    </div>

    <DefaultDialog
        v-model="showDialog"
        :title="`Atualizar ${outdatedCount} itens?`"
        :content="`Ao clicar em 'Atualizar', TODOS os produtos e serviços desatualizados (${outdatedCount})
        dessa marca serão sincronizados com os dados mais recentes dos posts e comentários.
        Nome e descrição dos itens podem sofrer alterações.`"
        confirm-button-text="ATUALIZAR"
        confirm-button-color="primary"
        @confirm="handleUpdateAll"
    />

    <ItemResultsModal
        v-model="showItemResultsModal"
        :item="selectedItem!"
    />
</template>