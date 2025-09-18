<script setup lang="ts">
import { computed } from 'vue'

    type Props = {
        modelValue: boolean
        title: string
        content: string
        confirmButtonText?: string
        confirmButtonColor?: string
        confirmButtonAction?: () => void
    }

    type Emits = {
        (e: 'update:modelValue', value: boolean): void
        (e: 'confirm'): void
        (e: 'cancel'): void
    }

    const props = withDefaults(defineProps<Props>(), {
        confirmButtonText: 'CONFIRMAR',
        confirmButtonColor: 'primary-light',
    })

    const emit = defineEmits<Emits>()

    // Computed para controlar o modal
    const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
    })

    // Função para confirmar
    const handleConfirm = () => {
    if (props.confirmButtonAction) {
        props.confirmButtonAction()
    }
    emit('confirm')
        isOpen.value = false
    }

    // Função para cancelar
    const handleCancel = () => {
        emit('cancel')
        isOpen.value = false
    }
</script>

<template>
  <v-dialog
    v-model="isOpen"
    :max-width="500"
  >
    <v-card
      class="text-center default-dialog"
      rounded="lg"
      elevation="8"
    >
      <!-- Título -->
      <v-card-title 
        class="text-h5 font-weight-semibold text-font-primary pa-4"
      >
        {{ title }}
      </v-card-title>

      <!-- Conteúdo -->
      <v-card-text 
        class="text-body-1 text-font-secondary pt-0"
      >
        {{ content }}
      </v-card-text>

      <!-- Botões de ação -->
      <v-card-actions 
        class="pa-6 pt-0 justify-center ga-3"
      >
        <v-spacer></v-spacer>
        <v-btn
          @click="handleCancel"
          variant="outlined"
          color="surface-variant"
          density="comfortable"
          size="x-large"
          rounded="lg"
          class="font-weight-bold text-subtitle-2 cancel-button"
          style="min-width: 120px;"
        >
          CANCELAR
        </v-btn>
        
        <v-btn
          @click="handleConfirm"
          class="font-weight-bold text-subtitle-2 confirm-button"
          :color="confirmButtonColor"
          variant="flat"
          density="comfortable"
          size="x-large"
          rounded="lg"
          style="min-width: 120px;"
        >
          {{ confirmButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
    .default-dialog {
        border-radius: 16px !important;
    }

    .confirm-button {
        color: white !important;
    }
    .confirm-button:hover {
    opacity: 0.9;
    box-shadow: 0 0px 8px rgba(0, 0, 0, 0.2) !important;
    }

    .cancel-button:hover {
        opacity: 0.9;
    }
</style>
