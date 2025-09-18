<script setup lang="ts">
    import { ref, computed } from 'vue'
    import BrandCard from '@/components/home/BrandCard.vue'
    import BrandModal from '@/components/home/BrandModal.vue'
    import DefaultDialog from '@/components/DefaultDialog.vue'
    import type { Brand } from '@/models/brand'

    const brands = ref<Brand[]>([
        {
            id: '1',
            name: 'Motorola',
            about: 'Empresa de telecomunicações e eletrônicos, conhecida por seus smartphones e soluções de comunicação.',
            pages: [
                { id: '1', title: 'Motorola Brasil', page_description: 'Página oficial da Motorola no Brasil' },
                { id: '2', title: 'Motorola Mobility', page_description: 'Smartphones e dispositivos móveis' }
            ]
        },
        {
            id: '2',
            name: 'Samsung',
            about: 'Conglomerado sul-coreano líder em tecnologia, eletrônicos e semicondutores.',
            pages: [
                { id: '3', title: 'Samsung Brasil', page_description: 'Página oficial da Samsung no Brasil' },
                { id: '4', title: 'Samsung Mobile', page_description: 'Smartphones Galaxy e dispositivos móveis' }
            ]
        },
        {
            id: '3',
            name: 'Apple',
            about: 'Empresa americana de tecnologia, criadora do iPhone, iPad, Mac e outros produtos inovadores.',
            pages: [
                { id: '5', title: 'Apple Brasil', page_description: 'Página oficial da Apple no Brasil' }
            ]
        },
        {
            id: '4',
            name: 'Xiaomi',
            about: 'Empresa chinesa de tecnologia focada em smartphones, eletrônicos e produtos para casa inteligente.',
            pages: [
                { id: '6', title: 'Xiaomi Brasil', page_description: 'Página oficial da Xiaomi no Brasil' },
                { id: '7', title: 'Mi Brasil', page_description: 'Produtos Mi e Redmi no Brasil' }
            ]
        }
    ])

    const handleBrandCardClick = (brand: Brand) => {
        console.log('Marca clicada: '+ brand.name)
        // Aqui você pode adicionar navegação ou outras ações
        // Por exemplo: router.push(`/brand/${brand.id}`)
    }

    // Estado do modal
    const showModal = ref(false)
    const editingBrand = ref<Brand | undefined>(undefined)
    
    // Estados dos diálogos de confirmação
    const showUpdateDialog = ref(false)
    const showDeleteDialog = ref(false)
    const brandToDelete = ref<Brand | undefined>(undefined)

    const handleAddBrand = () => {
        editingBrand.value = undefined
        showModal.value = true
    }

    const handleEditBrand = (brand: Brand) => {
        console.log('Editando marca:', brand.name)
        console.log('Brands antes da edição:', brands.value.length)
        editingBrand.value = brand
        showModal.value = true
    }

    const handleDeleteBrand = (brand: Brand) => {
        brandToDelete.value = brand
        showDeleteDialog.value = true
    }
    
    const confirmDeleteBrand = () => {
        if (brandToDelete.value) {
            const index = brands.value.findIndex(b => b.id === brandToDelete.value!.id)
            if (index > -1) {
                brands.value.splice(index, 1)
                console.log('Marca deletada:', brandToDelete.value.name)
            }
            brandToDelete.value = undefined
        }
    }
    
    const handleUpdateAll = () => {
        showUpdateDialog.value = true
    }
    
    const confirmUpdateAll = () => {
        console.log('Atualizando todos os itens...')
        // Aqui você implementaria a lógica de atualização
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

    const handleSaveBrand = (brandData: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => {
        console.log('Salvando brand:', brandData.name)
        console.log('Brands antes de salvar:', brands.value.length)
        
        if (editingBrand.value) {
            // Editar marca existente
            const index = brands.value.findIndex(b => b.id === editingBrand.value!.id)
            if (index > -1) {
                brands.value[index] = {
                    ...brands.value[index],
                    ...brandData,
                    updatedAt: new Date()
                }
                console.log('Marca editada:', brands.value[index])
            }
        } else {
            // Adicionar nova marca
            const newBrand: Brand = {
                ...brandData,
                id: (brands.value.length + 1).toString(),
                createdAt: new Date(),
                updatedAt: new Date()
            }
            brands.value.push(newBrand)
            console.log('Nova marca cadastrada:', newBrand)
        }
        
        console.log('Brands depois de salvar:', brands.value.length)
        editingBrand.value = undefined
    }
</script>
<template>
    <v-container class="pt-16 px-16 container" fluid>
        <div class="text-center mb-8">
            <h1 class="text-h2 text-font-primary font-weight-bold">
                Analisador de produtos e marcas
            </h1>
            
            <!-- Botões de exemplo para demonstrar os diálogos -->
             <!-- TODO: remover o seguinte -->
            <div class="mt-4 mb-6">
                <v-btn
                    @click="handleUpdateAll"
                    color="primary"
                    variant="outlined"
                    class="mr-4"
                >
                    Exemplo: Atualizar Todos
                </v-btn>
                <v-btn
                    @click="() => { brandToDelete = brands[0]; showDeleteDialog = true }"
                    color="error"
                    variant="outlined"
                >
                    Exemplo: Excluir Marca
                </v-btn>
            </div>
        </div>
        
        <v-row class="justify-start" no-gutters>
            <v-col v-for="(brand, index) in brands" :key="`brand-${brand.id}-${index}`" cols="6" lg="4">
                {{ console.log('Renderizando brand:', brand.name, 'index:', index) }}
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
    
    <!-- Diálogo de confirmação para atualizar todos os itens -->
    <DefaultDialog
        v-model="showUpdateDialog"
        title="Atualizar todos os itens?"
        content="Ao clicar em 'Atualizar', todos os itens desatualizados serão atualizados automaticamente."
        confirm-button-text="ATUALIZAR"
        confirm-button-color="#0cc0df"
        :confirm-button-action="confirmUpdateAll"
        @confirm="confirmUpdateAll"
    />
    
    <!-- Diálogo de confirmação para excluir marca -->
    <DefaultDialog
        v-model="showDeleteDialog"
        :title="deleteDialogTitle"
        :content="deleteDialogContent"
        confirm-button-text="EXCLUIR"
        confirm-button-color="#A51C24"
        :confirm-button-action="confirmDeleteBrand"
        @confirm="confirmDeleteBrand"
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
