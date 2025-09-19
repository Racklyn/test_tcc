import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { pt } from 'vuetify/locale'

const defaultTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        'surface-card': '#F6F9FA',
        'surface-card-2': '#F6F6F6',
        'surface-light': '#EEEEEE',
        'surface-variant': '#A6A6A6',
        'on-surface-variant': '#EEEEEE',
        'primary-light': '#00ccff',
        primary: '#0cc0df',
        'primary-darken-1': '#0097b2',
        secondary: '#5271ff',
        'secondary-darken-1': '#004aad',
        error: '#9f1414',
        info: '#2196F3',
        success: '#00bf63',
        warning: '#FB8C00',
        'font-primary': '#343637',
        'font-secondary': '#545454',
        'font-light': '#D9D9D9',

    },
    variables: {
        'border-color': '#000000',
        'border-opacity': 0.12,
        'high-emphasis-opacity': 0.87,
        'medium-emphasis-opacity': 0.60,
        'disabled-opacity': 0.38,
        'idle-opacity': 0.04,
        'hover-opacity': 0.04,
        'focus-opacity': 0.12,
        'selected-opacity': 0.08,
        'activated-opacity': 0.12,
        'pressed-opacity': 0.12,
        'dragged-opacity': 0.08,
        'theme-kbd': '#212529',
        'theme-on-kbd': '#FFFFFF',
        'theme-code': '#F5F5F5',
        'theme-on-code': '#000000',
    }
}

const vuetify = createVuetify({
    locale: {
        locale: 'pt',
        messages: { pt }
    },
    components,
    directives,
    theme: {
        defaultTheme: 'defaultTheme',
        themes: {
            defaultTheme,
        },
    },
})

export default vuetify