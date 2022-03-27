import { createApp } from 'vue';
import store from './store';
import App from './App.vue';
import './assets/tailwind.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(store)
  .use(VueAxios, axios)
  .mount('#app');
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
