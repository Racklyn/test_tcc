<script setup lang="ts">
    import { ref, computed, onMounted, provide, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import brandService from '@/services/brandService'
    import type { BrandWithItemsAndStatistics } from '@/models/brand'
    import DefaultDialog from '@/components/DefaultDialog.vue'

    const route = useRoute()
    const router = useRouter()

    const tabs = [
        { name: 'brand', label: 'MARCA', component: 'BrandView' },
        { name: 'posts', label: 'PUBLICAÇÕES', component: 'PostsView' },
        { name: 'items', label: 'PRODUTOS E SERVIÇOS', component: 'ItemsView' }
    ]

    // Função para obter o índice da aba baseado na rota atual
    const getTabIndexFromRoute = (routeName: string): number => {
        const tabIndex = tabs.findIndex(tab => tab.name === routeName)
        return tabIndex !== -1 ? tabIndex : 0
    }

    const activeTab = ref(getTabIndexFromRoute(route.name as string))
    const brand = ref<BrandWithItemsAndStatistics | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Estados de loading centralizados
    const loadingAnalysis = ref(false)
    const loadingExtraction = ref(false)
    const isUpdating = ref(false)

    // Estado do dialog de conclusão
    const showCompletionDialog = ref(false)
    const dialogConfig = ref({
        title: '',
        content: ''
    })

    const completionMessages = {
        analysis: {
            title: 'Análise de sentimentos concluída',
            content: 'A análise de sentimentos foi executada com sucesso! Os produtos e serviços foram identificados e analisados com base nas publicações.'
        },
        extraction: {
            title: 'Extração de publicações concluída',
            content: 'A extração de publicações foi executada com sucesso! Novas publicações e comentários foram coletados das páginas da marca.'
        },
        updating: {
            title: 'Atualização de itens concluída',
            content: 'A atualização dos itens foi executada com sucesso! Todos os produtos e serviços desatualizados foram sincronizados com os dados mais recentes.'
        }
    }

    // Fornecer o brand e estados de loading para os componentes filhos
    provide('selectedBrand', brand)
    provide('loadingAnalysis', loadingAnalysis)
    provide('loadingExtraction', loadingExtraction)
    provide('isUpdating', isUpdating)

    const brandName = computed(() => {
        return brand.value?.name || '...'
    })

    const switchTab = (index: number) => {
        activeTab.value = index
        const tab = tabs[index]
        router.push({ name: tab.name, params: { brandId: route.params.brandId } })
    }

    const goBack = () => {
        router.push('/')
    }

    const fetchBrand = async () => {
        if (!route.params.brandId) {
            error.value = 'ID da marca não fornecido'
            return
        }

        loading.value = true
        error.value = null

        try {
            brand.value = await brandService.getWithItemsAndStatistics(
                route.params.brandId as string,
                { item_sort_by: 'last_sync', item_sort_order: 'desc' }
            )
        } catch (err) {
            console.error('Erro ao buscar marca:', err)
            error.value = 'Erro ao carregar informações da marca'
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchBrand()
    })

    // Watch para recarregar dados quando operações de loading terminam
    watch([loadingAnalysis, loadingExtraction, isUpdating], ([analysis, extraction, updating], [prevAnalysis, prevExtraction, prevUpdating]) => {
        // Se algum estado mudou de true para false, recarregar os dados e mostrar dialog
        if (prevAnalysis && !analysis) {
            // Análise de sentimentos terminou
            fetchBrand()
            showCompletionDialog.value = true
            dialogConfig.value = {
                title: completionMessages.analysis.title,
                content: completionMessages.analysis.content
            }
        } else if (prevExtraction && !extraction) {
            // Extração de publicações terminou
            fetchBrand()
            showCompletionDialog.value = true
            dialogConfig.value = {
                title: completionMessages.extraction.title,
                content: completionMessages.extraction.content
            }
        } else if (prevUpdating && !updating) {
            // Atualização de itens terminou
            fetchBrand()
            showCompletionDialog.value = true
            dialogConfig.value = {
                title: completionMessages.updating.title,
                content: completionMessages.updating.content
            }
        }
    })
</script>

<template>
    <div class="d-flex flex-column fill-height">
        <!-- Cabeçalho -->
        <v-container class="pt-8 px-16 container" fluid>
            <div class="d-flex justify-center align-center position-relative">
                <v-btn
                    variant="text"
                    @click="goBack"
                    class="position-absolute left-0 pr-16"
                >
                    <v-icon
                        color="font-secondary"
                        class="mr-4"
                        size="36"
                    >
                        mdi-arrow-left
                    </v-icon>
                    <p class="text-subtitle-1 text-font-primary">VOLTAR</p>
                </v-btn>
    
                <h1 class="text-h2 text-font-primary font-weight-bold">
                    {{ brandName }}
                </h1>
            </div>

            <div class="px-4 d-flex justify-center ga-1 mt-5">
                <v-btn
                    v-for="(tab, index) in tabs"
                    :key="tab.name"
                    @click="switchTab(index)"
                    :disabled="loading"
                    variant="flat"
                    density="comfortable"
                    :color="activeTab === index ? 'primary' : 'surface-variant'"
                    class="font-weight-bold text-body-2 btn-tab"
                >
                    <p :class="activeTab === index ? 'text-white' : 'text-font-light-2'">
                        {{ tab.label }}
                    </p>
                </v-btn>
            </div>
        </v-container>

        <!-- Conteúdo das views -->
        <v-container class="px-8 h-100">
            <!-- Erro ao carregar marca -->
            <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4 mx-8"
                @click:close="error = null"
            >
                {{ error }}
            </v-alert>

            <!-- Loading -->
            <div v-else-if="loading" class="h-100 d-flex flex-column align-center justify-center">
                <v-progress-circular
                    indeterminate
                    size="64"
                    color="teal"
                />
                <p class="mt-4 text-grey">Carregando informações da marca...</p>
            </div>

            <!-- Conteúdo normal -->
            <router-view v-else @refresh-brand="fetchBrand" />
        </v-container>
    </div>

    <DefaultDialog
        v-model="showCompletionDialog"
        :title="dialogConfig.title"
        :content="dialogConfig.content"
        confirm-button-text="OK"
        no-cancel-button
        @confirm="showCompletionDialog = false"
    />
</template>

<style scoped>
    .btn-tab {
        width: 280px;
        border-radius: 6px;
    }

    .btn-tab:hover {
        transform: scale(1.01);
    }
</style>