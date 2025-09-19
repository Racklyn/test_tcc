<script setup lang="ts">
    import { ref } from 'vue'

    const searchText = ref('')
</script>

<template>
    <div class="d-flex ga-3 align-center w-100">
        <v-text-field
            v-model="searchText"
            placeholder="Pesquisar... (indisponível)"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            readonly
        />
       


        <v-btn

            variant="outlined"
            color="primary-darken-1"
            class="font-weight-bold text-body-2"
            rounded="lg"
            style="width: 140px; height: 40px;"
        >
            FILTROS

            <v-tooltip
                text="Função disponível em breve"
                activator="parent"
                position="bottom"
            />
        </v-btn>
    </div>
</template>

<style scoped>
    :deep(.v-field--disabled) {
        border-color: #e0e0e0;
        background-color: #f5f5f5;
    }

    :deep(.v-field--disabled .v-field__input) {
        color: #9e9e9e;
    }

    :deep(.v-field--disabled .v-field__prepend-inner) {
        color: #9e9e9e;
    }
</style>
