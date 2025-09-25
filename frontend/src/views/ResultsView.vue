<script setup lang="ts">
    import { ref, computed, onMounted, provide } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import brandService from '@/services/brandService'
    import type { BrandWithItemsAndStatistics } from '@/models/brand'

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

    // Fornecer o brand para os componentes filhos
    provide('selectedBrand', brand)

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
            brand.value = await brandService.getWithItemsAndStatistics(route.params.brandId as string)
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
            <router-view v-else />
        </v-container>
    </div>
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