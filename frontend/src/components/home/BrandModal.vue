<script setup lang="ts">
    import { ref, computed, watch } from 'vue'
    import type { Brand } from '@/models/brand'
    import type { Page } from '@/models/page'
    import ActionButton from './ActionButton.vue'

    type Props = {
        modelValue: boolean,
        brand?: Brand
    }

    type Emits = {
        (e: 'update:modelValue', value: boolean): void
        (e: 'save', brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): void
    }

    const props = defineProps<Props>()
    const emit = defineEmits<Emits>()

    // Dados do formulário
    const form = ref({
        name: '',
        about: ''
    })

    const pages = ref<Page[]>([
        { id: '1', title: '', page_description: '' }
    ])

    // Popular formulário quando brand for fornecida
    const populateForm = () => {
        if (props.brand) {
            form.value = {
                name: props.brand.name,
                about: props.brand.about
            }
            pages.value = props.brand.pages.length > 0 
                ? [...props.brand.pages] 
                : [{ id: '1', title: '', page_description: '' }]
        } else {
            resetForm()
        }
    }

    // Observar mudanças na prop brand apenas quando o modal abrir
    watch(() => props.modelValue, (isOpen) => {
        if (isOpen) {
            populateForm()
        }
    })


    // Computed para controlar o modal
    const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
    })

    // Adicionar nova página
    const addPage = () => {
    const newId = (pages.value.length + 1).toString()
    pages.value.push({
        id: newId,
        title: '',
        page_description: ''
    })
    }

    // Remover página
    const removePage = (index: number) => {
    if (pages.value.length > 1) {
        pages.value.splice(index, 1)
    }
    }

    // Salvar marca
    const saveBrand = () => {
        const brandData = {
            name: form.value.name,
            about: form.value.about,
            pages: pages.value.filter(page => page.title.trim() !== '')
        }
        
        emit('save', brandData)
        closeModal()
    }

    // Fechar modal e resetar formulário
    const closeModal = () => {
        isOpen.value = false
    }

    // Resetar formulário
    const resetForm = () => {
        form.value = {
            name: '',
            about: ''
        }
        pages.value = [
            { id: '1', title: '', page_description: '' }
        ]
    }
</script>

<template>
  <v-dialog
    v-model="isOpen"
    max-width="600"
  >
    <v-card class="brand-modal text-font-primary">
      <v-card-title class="text-h4 text-center pt-6">
        {{ brand ? 'Editar marca' : 'Nova marca' }}
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="form.name"
          label="Nome"
          variant="outlined"
          density="comfortable"
          class="mb-2"
          rounded="lg"
          required
        />

        <v-textarea
          v-model="form.about"
          label="Descrição da marca"
          variant="outlined"
          density="comfortable"
          rows="2"
          class="mb-2"
          rounded="lg"
          required
        />

        <div class="mb-4">
          <h3 class="text-h6 mb-4">Páginas</h3>
          
          <div
            v-for="(page, index) in pages"
            :key="page.id"
            class="d-flex mb-1"
          >
            <v-text-field
                v-model="page.title"
                placeholder="Título da página"
                variant="outlined"
                density="compact"
                class="mr-3 page-field"
                rounded="lg"
                bg-color="primary-darken-1"
                style="max-width: 180px;"
            />
            
            <v-text-field
              v-model="page.page_description"
              label="Descrição"
              variant="outlined"
              density="compact"
              class="mr-3 page-description-field"
              bg-color="surface-light"
              rounded="lg"
            />
            
            <ActionButton
              icon="mdi-trash-can"
              @click="removePage(index)"
              :disabled="pages.length === 1"
            />
          </div>
          
          <v-tooltip text="Adicionar página">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-plus-thick"
                variant="flat"
                color="surface-variant"
                size="small"
                @click="addPage"
                class="mt-1"
              />
            </template>
          </v-tooltip>

        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          @click="closeModal"
          variant="outlined"
          color="surface-variant"
          class="mr-3 font-weight-bold text-body-2"
          style="width: 130px;"
          size="x-large"
          rounded="lg"
        >
          CANCELAR
        </v-btn>
        <v-btn
          color="primary-light"
          class="font-weight-bold text-body-2"
          style="color: white !important; width: 130px;"
          variant="flat"
          @click="saveBrand"
          :disabled="!form.name.trim() || !form.about.trim()"
          size="x-large"
          rounded="lg"
        >
          {{brand ? 'SALVAR' : 'CADASTRAR'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
    .brand-modal {
        border-radius: 16px !important;
    }

    .page-field {
        transition: all 0.3s;
    }

    .page-field:hover {
        opacity: 0.9;
    }

    .page-description-field :deep(input) {
        color: #343637 !important;
    }
    .v-btn:disabled {
        background-color: #878787 !important;
        color: #ffffff !important;
        opacity: 0.6 !important;
    }

</style>
