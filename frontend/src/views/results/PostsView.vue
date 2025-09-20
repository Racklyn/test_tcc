<script setup lang="ts">
    import { computed, inject, type Ref } from 'vue';
    import SearchBarFilter from '@/components/SearchBarFilter.vue'
    import PostCard from '@/components/results/PostCard.vue'
    import type { BrandWithItemsAndStatistics } from '@/models/brand';

    // Injetar o brand fornecido pela ResultsView
    const selectedBrand = inject<Ref<BrandWithItemsAndStatistics | null>>('selectedBrand')

    const posts = computed(() => {
        return selectedBrand?.value?.items.map((item) => item.posts).flat().filter((post) => post !== undefined) || []
    })
</script>

<template>
    <SearchBarFilter />
    
    <p class="text-body-1 font-weight-bold text-font-secondary my-3 ml-4">
        <strong>{{ posts?.length }}</strong> publicações
    </p>

    <v-row>
        <v-col
            v-for="post in posts" :key="post.id"
            class="d-flex justify-space-around mb-4"
            cols="6"
            lg="6"
        >
            <PostCard :post="post" />
        </v-col>
    </v-row>
</template>
