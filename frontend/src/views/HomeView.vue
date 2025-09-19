<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import BrandCard from '@/components/home/BrandCard.vue'
    import BrandModal from '@/components/home/BrandModal.vue'
    import DefaultDialog from '@/components/DefaultDialog.vue'
    import brandService from '@/services/brandService'
    import type { Brand, CreateBrandDto, UpdateBrandDto } from '@/models/brand'
    import { USER_ID } from '@/utils/commons'
    import router from '@/router'

    // Estado das marcas
    const brands = ref<Brand[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Função para carregar marcas da API
    const loadBrands = async () => {
        try {
            loading.value = true
            error.value = null
            
            const queryParams = {
                user_id: USER_ID,
            }
            
            const brandsData = await brandService.get(queryParams)
            brands.value = brandsData
            console.log('Marcas carregadas:', brandsData)
        } catch (err) {
            console.error('Erro ao carregar marcas:', err)
            error.value = 'Erro ao carregar marcas. Tente novamente.'
            errorType.value = 'load'
            showErrorDialog.value = true
        } finally {
            loading.value = false
        }
    }

    // Carregar marcas quando o componente for montado
    onMounted(() => {
        loadBrands()
    })

    const handleBrandCardClick = (brand: Brand) => {
        router.push(`/results/${brand.id}`)
    }

    const showModal = ref(false)
    const editingBrand = ref<Brand | undefined>(undefined)
    
    // Estados dos diálogos de confirmação
    const showDeleteDialog = ref(false)
    const showErrorDialog = ref(false)
    const brandToDelete = ref<Brand | undefined>(undefined)
    const errorType = ref<'load' | 'delete' | null>(null)

    const handleAddBrand = () => {
        editingBrand.value = undefined
        showModal.value = true
    }

    const handleEditBrand = (brand: Brand) => {
        editingBrand.value = brand
        showModal.value = true
    }

    const handleDeleteBrand = (brand: Brand) => {
        brandToDelete.value = brand
        showDeleteDialog.value = true
    }
    
    const confirmDeleteBrand = async () => {
        if (brandToDelete.value) {
            try {
                await brandService.delete(brandToDelete.value.id)
                await loadBrands()
            } catch (err) {
                console.error('Erro ao deletar marca:', err)
                error.value = 'Erro ao deletar marca. Tente novamente.'
                errorType.value = 'delete'
                showErrorDialog.value = true
            } finally {
                brandToDelete.value = undefined
            }
        }
    }

    const closeErrorDialog = () => {
        showErrorDialog.value = false
        error.value = ''
    }
    
    // Computed properties para os diálogos
    const deleteDialogTitle = computed(() => {
        return brandToDelete.value ? `Excluir marca "${brandToDelete.value.name}"?` : 'Excluir marca?'
    })
    
    const deleteDialogContent = computed(() => {
        return brandToDelete.value 
            ? `Você também estará apagando todas as publicações, produtos, serviços e análises referentes a marca "${brandToDelete.value.name}"`
            : 'Tem certeza que deseja excluir esta marca?'
    })
    
    const errorButtonText = computed(() => {
        return errorType.value === 'delete' ? 'OK' : 'TENTAR NOVAMENTE'
    })

    const handleSaveBrand = async (brandData: CreateBrandDto) => {
        try {
            if (editingBrand.value) {
                const updatedBrand: UpdateBrandDto = {
                    id: editingBrand.value.id,
                    name: brandData.name,
                    about: brandData.about,
                    pages: brandData.pages,
                    user_id: USER_ID
                }
                await brandService.update(updatedBrand)
            } else {
                await brandService.create(brandData)
            }
            
            await loadBrands()
        } catch (err: any) {
            console.error('Erro ao salvar marca:', err)
            error.value = 'Erro ao salvar marca. Tente novamente.'
            errorType.value = 'load'
            showErrorDialog.value = true
        } finally {
            editingBrand.value = undefined
        }
    }
</script>
<template>
    <v-container class="pt-8 px-16 container" fluid>
        <div class="text-center mb-16">
            <h1 class="text-h2 text-font-primary font-weight-bold">
                Analisador de produtos e marcas
            </h1>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-8">
            <v-progress-circular
                indeterminate
                color="primary"
                size="64"
            ></v-progress-circular>
            <p class="mt-4 text-body-1">Carregando marcas...</p>
        </div>


        <!-- Brands grid -->
        <v-row v-else class="justify-start" no-gutters>
            <v-col v-for="(brand, index) in brands" :key="`brand-${brand.id}-${index}`" cols="6" lg="4">
                <div class="d-flex justify-start mb-8">
                    <BrandCard 
                        :brand="brand"
                        @click="handleBrandCardClick(brand)"
                        @edit="handleEditBrand"
                        @delete="handleDeleteBrand"
                    />
                </div>
            </v-col>
        </v-row>

        <!-- Empty state -->
        <div v-if="!loading && !error && brands.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-package-variant</v-icon>
            <h3 class="text-h5 text-grey-lighten-1 mt-4">Nenhuma marca encontrada</h3>
            <p class="text-body-1 text-grey-lighten-1">Clique no botão + para adicionar sua primeira marca</p>
        </div>
    </v-container>

    <v-tooltip
        text="Adicionar marca"
    >
        <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props"
                color="primary-light"
                size="x-large"
                class="position-fixed bottom-0 right-0 elevation-8 plus-button"
                @click="handleAddBrand"
                icon
            >
                <v-icon
                    color="white"
                    size="large"
                >mdi-plus-thick</v-icon>
            </v-btn>
        </template>
    </v-tooltip>

    <!-- Modal para cadastrar/editar marca -->
    <BrandModal
        v-model="showModal"
        :brand="editingBrand"
        @save="handleSaveBrand"
    />
    
    <!-- Diálogo de confirmação para excluir marca -->
    <DefaultDialog
        v-model="showDeleteDialog"
        :title="deleteDialogTitle"
        :content="deleteDialogContent"
        confirm-button-text="EXCLUIR"
        confirm-button-color="error"
        :confirm-button-action="confirmDeleteBrand"
        @confirm="confirmDeleteBrand"
    />
    
    <!-- Diálogo de erro -->
    <DefaultDialog
        v-model="showErrorDialog"
        persistent
        no-cancel-button
        title="Erro!"
        :content="error || ''"
        :confirm-button-text="errorButtonText"
        confirm-button-color="primary"
        :confirm-button-action="loadBrands"
        @confirm="closeErrorDialog"
    />
</template>

<style scoped>
    .container {
        max-width: 1600px;
    }

    .plus-button {
        margin-right: 100px;
        margin-bottom: 80px;
    }
</style>
