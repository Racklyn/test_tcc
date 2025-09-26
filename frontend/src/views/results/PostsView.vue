<script setup lang="ts">
    import { computed, inject, onMounted, ref, type Ref } from 'vue';
    import SearchBarFilter from '@/components/SearchBarFilter.vue'
    import PostCard from '@/components/results/PostCard.vue'
    import type { BrandWithItemsAndStatistics } from '@/models/brand';
    import type { PostWithItem } from '@/models/post';
    import postService from '@/services/postService';
    import { formatDateTime } from '@/utils/dateFormat';
    import DefaultDialog from '@/components/DefaultDialog.vue';

    // Injetar o brand fornecido pela ResultsView
    const selectedBrand = inject<Ref<BrandWithItemsAndStatistics | null>>('selectedBrand')

    const posts = ref<PostWithItem[]>([])
    const loading = ref(false)
    const showDialog = ref(false)
    const dialogConfig = ref({
        title: '',
        content: '',
        confirmText: '',
        confirmColor: '',
        onConfirm: () => {}
    })


    const lastExtractionDate = computed(() => {
        //TODO: ajustar essa data. Essa não é a última data da extração. Preciso salvá-la na marca após extrações
        return selectedBrand?.value?.updated_date ? formatDateTime(selectedBrand.value.updated_date) : 'nunca'
    })

    const lastAnalysisDate = computed(() => {
        //TODO: ajustar essa data. Essa não é a última data da análise. Preciso salvá-la na marca após análises
        return selectedBrand?.value?.updated_date ? formatDateTime(selectedBrand.value.updated_date) : 'nunca'
    })

    const openDialog = (config: typeof dialogConfig.value) => {
        dialogConfig.value = config
        showDialog.value = true
    }

    const extractPosts = async () => {
        //TODO: implementar a extração de publicações (chamar API do scraper)
        console.log('Extraindo publicações...')
    }

    const analyzePosts = async () => {
        //TODO: implementar a análise de sentimentos (chamar API de IA)
        console.log('Analisando sentimentos...')
    }

    const fetchPosts = async () => {
        if (!selectedBrand?.value?.id) return
        loading.value = true
        try {
            posts.value = await postService.getAllPostsAndItemsFromBrand(
                { brand_id: selectedBrand.value.id }
            )
        } catch (error) {
            console.error('Erro ao buscar publicações:', error)
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchPosts()
    })
</script>

<template>
    <div style="padding-bottom: 500px;">
        <SearchBarFilter />
        
        <p class="text-body-1 font-weight-bold text-font-secondary my-3 ml-4">
            <strong>{{ posts?.length }}</strong> publicações
        </p>

        <v-row v-if="loading">
            <v-col cols="12"  class="d-flex justify-center align-center mt-12">
                <v-progress-circular indeterminate size="64" color="teal" />
            </v-col>
        </v-row>

        <v-row v-else>
            <v-col
                v-if="posts.length > 0"
                v-for="post in posts" :key="post.id"
                class="d-flex justify-space-around mb-4"
                cols="6"
                lg="6"
            >
                <PostCard :post="post" />
            </v-col>

            <v-col v-else cols="12" class="d-flex flex-column justify-center align-center mt-12">
                <v-icon size="64" color="grey-lighten-1">mdi-package-variant</v-icon>
                <h3 class="text-h5 text-grey-lighten-1 mt-4">Nenhuma publicação encontrada</h3>
                <p class="text-body-1 text-grey-lighten-1 mt-6">
                    Clique em "Extrair novas publicações" para rodar o scraper nas páginas do Facebook dessa marca
                </p>
            </v-col>
        </v-row>
    </div>

    <!-- Footer fixo -->
    <v-footer
        class="text-center position-fixed bottom-0 left-0 right-0"
        :elevation="8"
        style="background-color: #FFFFFFF0;"
    >
        <v-container class="d-flex justify-space-around px-10 mt-1">
            <div class="d-flex flex-column align-center">
                <v-btn
                    variant="flat"
                    color="scraper-color"
                    size="x-large"
                    rounded="lg"
                    append-icon="mdi-cloud-download-outline"
                    class="font-weight-bold text-body-1"
                    @click="openDialog({
                        title: 'Extrair novas publicações',
                        content: 'Ao confirmar, o script pegará novas publicações e comentários de todas as páginas cadastradas para essa marca. Isso pode levar alguns minutos.',
                        confirmText: 'EXTRAIR',
                        confirmColor: 'scraper-color',
                        onConfirm: extractPosts
                    })"
                >
                    Extrair novas publicações
                </v-btn>

                <p class="text-caption text-font-secondary mt-1">
                    Última extração para essa marca: {{ lastExtractionDate }}
                </p>
            </div>

            <div class="d-flex flex-column align-center">
                <v-btn
                    variant="flat"
                    color="analysis-color"
                    size="x-large"
                    rounded="lg"
                    append-icon="mdi-drama-masks"
                    class="font-weight-bold text-body-1"
                    @click="openDialog({
                        title: 'Executar análise de sentimentos',
                        content: 'Ao confirmar, a análise de sentimentos será executada para todas as publicações dessa marca. Isso pode levar alguns minutos.',
                        confirmText: 'EXECUTAR',
                        confirmColor: 'analysis-color',
                        onConfirm: analyzePosts
                    })"
                >
                    Executar análise de sentimentos
                </v-btn>

                <p class="text-caption text-font-secondary mt-1">
                    Última análise de sentimentos: {{ lastAnalysisDate }}
                </p>
            </div>
    
        </v-container>
    </v-footer>

    <!-- Dialog adaptável -->
    <DefaultDialog
        v-model="showDialog"
        :title="dialogConfig.title"
        :content="dialogConfig.content"
        :confirm-button-text="dialogConfig.confirmText"
        :confirm-button-color="dialogConfig.confirmColor"
        @confirm="dialogConfig.onConfirm"
    />
</template>

<style scoped>
    .v-footer {
        background-color: #A6A6A633;
    }
</style>