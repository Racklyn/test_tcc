import './style.css';

import { createApp } from 'vue';
//import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
// import { vMaska } from 'maska';

const app = createApp(App);

// app.use(createPinia());
app.use(router);
app.use(vuetify);
//app.directive('maska', vMaska);

app.mount('#app');