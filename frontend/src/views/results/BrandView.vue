<script setup lang="ts">
    import { computed, inject, type Ref } from 'vue'
    import type { BrandWithItemsAndStatistics } from '@/models/brand'
    import PageChip from '@/components/PageChip.vue';
    import PercentChip from '@/components/PercentChip.vue';

    // Injetar o brand fornecido pela ResultsView
    const selectedBrand = inject<Ref<BrandWithItemsAndStatistics | null>>('selectedBrand')
    
    const bestItem = computed(() => {
        const items = selectedBrand?.value?.items.filter((item) => item.item_average_score) ?? []
        const orderedItems = items.sort((a, b) => b.item_average_score! - a.item_average_score!) ?? []
        return orderedItems[0]
    })

    const worstItem = computed(() => {
        const items = selectedBrand?.value?.items.filter((item) => item.item_average_score) ?? []
        const orderedItems = items.sort((a, b) => a.item_average_score! - b.item_average_score!) ?? []
        return orderedItems[0]
    })

    const scoreToPercent = (score: number | undefined) => {
        if (!score) return -1
        return Math.round((score)*100)
    }
    

</script>

<template>
    <div class="d-flex flex-column h-100 pb-10">
        <h2 class="text-center text-primary-darken-1 pa-4">Visão geral da marca</h2>
        
        <div class="flex-grow-1 d-flex space-between">
            <v-card 
                class="pa-4 border border-black w-50 text-font-primary "
                rounded="xl"
                flat
                color="surface-card-2"
            >
                 <v-card-title class="d-flex align-center">
                    <div>
                        <h3 class="text-h5 font-weight-bold">NOME</h3>
                        <p class="text-h6 text-font-secondary">{{ selectedBrand?.name }}</p>
                    </div>
                     <v-spacer />
                     <v-avatar 
                         size="80" 
                         class="ml-3 border"
                         color="white"
                     >
                         <slot name="icon">
                             <v-icon size="50" color="primary-darken-1">mdi-panorama</v-icon>
                         </slot>
                     </v-avatar>
                 </v-card-title>

                 <v-card-text>
                    <h3 class="text-h5 font-weight-bold mt-10">SOBRE</h3>
                    <p class="text-h6 text-font-secondary">{{ selectedBrand?.about }}</p>

                    <h3 class="d-flex align-center ga-2 text-h5 font-weight-bold mt-10 mb-4">
                        PÁGINAS
                        <span class="text-font-secondary text-body-1">
                            ({{ selectedBrand?.pages?.length }})
                        </span>
                    </h3>
                     <div class="mb-4">
                        <div
                            v-for="value in selectedBrand?.pages || []"
                            :key="value.id"
                            class="d-flex align-center mb-4"
                        >
                            <PageChip
                                :text="value.title"
                                class="mr-4 font-weight-bold"
                                density="default"
                                style="width: 200px;"
                            />

                            <p class="text-body-1 text-font-secondary">{{ value.page_description }}</p>
                        </div>
                     </div>
                 </v-card-text>
            </v-card>

            <div class="w-50 py-4 px-10">
                <div class="d-flex justify-space-around ga-4 mb-8">
                    <PercentChip
                        :value="scoreToPercent(selectedBrand?.brand_average_score)"
                        text="Avaliação média"
                    />
                    <PercentChip
                        :value="scoreToPercent(selectedBrand?.brand_average_score)"
                        text="Outro valor qualquer"
                    />
                </div>

                <div class="d-flex align-center ga-4 mt-16 bg-surface-card-2 rounded-lg py-2 px-4">
                    <span>
                        <h3 class="text-h5 font-weight-bold text-font-primary">Melhor avaliação geral</h3>
                        <p class="text-h6 text-font-secondary">{{ bestItem?.name }}</p>
                    </span>
                    <v-spacer />
                    <PercentChip
                        :value="scoreToPercent(bestItem?.item_average_score)"
                        size="sm"
                    />
                </div>

                <div class="d-flex align-center ga-4 mt-8 bg-surface-card-2 rounded-lg py-2 px-4">
                    <span>
                        <h3 class="text-h5 font-weight-bold text-font-primary">Pior avaliação geral</h3>
                        <p class="text-h6 text-font-secondary">{{ worstItem?.name }}</p>
                    </span>
                    <v-spacer />
                    <PercentChip
                        :value="scoreToPercent(worstItem?.item_average_score)"
                        size="sm"
                    />
                </div>

                <!-- TODO: verificar se adicionarei mais informações aqui... -->
                <div class="d-flex align-center ga-4 mt-8 bg-surface-card-2 rounded-lg py-2 px-4">
                    <span>
                        <h3 class="text-h5 font-weight-bold text-font-primary">Outras informações...</h3>
                    </span>
                </div>
            </div>

        </div>
    </div>
</template>
