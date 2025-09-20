<script setup lang="ts">
    import { computed } from 'vue'

    type Props = {
        value: number
        text?: string
        size?: 'sm' | 'md' | 'lg'
    }

    const props = withDefaults(defineProps<Props>(), {
        size: 'lg'
    })

    const colorScale = {
        red:    { bg: '#efe6e1', textColor: '#ff5449'}, 
        orange: { bg: '#efe9e1', textColor: '#f57c00'},
        yellow: { bg: '#efebe1', textColor: '#ffb74a'},
        lime:   { bg: '#e9ebe2', textColor: '#80b917'},
        green:  { bg: '#e1efe3', textColor: '#00bf63'},
        none:   { bg: '#eeebf1', textColor: '#A6A6A6'}
    }

    const sizeConfigs = {
        sm: {
            textSize: 'text-caption',
            width: '40px',
            height: '32px'
        },
        md: {
            textSize: 'text-body-1',
            width: '50px',
            height: '36px'
        },
        lg: {
            textSize: 'text-h4',
            width: '100px',
            height: '80px'
        }
    }

    const isValidValue = computed(() => {
        return props.value >= 0 && props.value <= 100
    })

    const scale = computed(() => {
        const value = props.value
        
        if (!isValidValue.value) return 'none'
        if (value < 20) return 'red'
        if (value >= 20 && value < 40) return 'orange'
        if (value >= 40 && value < 60) return 'yellow'
        if (value >= 60 && value < 80) return 'lime'
        if (value >= 80 && value <= 100) return 'green'

        return 'none'
    })

    const chipColor = computed(() => colorScale[scale.value].bg)
    const textColor = computed(() => colorScale[scale.value].textColor)
</script>

<template>
    <div class="d-flex flex-column align-center" style="width: fit-content;">
        <v-chip
            :color="chipColor"
            class="font-weight-bold justify-center border-md chipStyle"
            :class="sizeConfigs[props.size].textSize"
            :style="{
                color: textColor,
                borderColor: `${textColor} !important`,
                width: sizeConfigs[props.size].width,
                height: sizeConfigs[props.size].height
            }"
            rounded="lg"
            variant="flat"
        >
            {{ isValidValue ? `${props.value}%` : '?' }}
        </v-chip>

        <p v-if="props.text" class="text-body-1 text-font-secondary text-center mt-3">
           {{ props.text }}
       </p>
    </div>
</template>

<style scoped>
</style>