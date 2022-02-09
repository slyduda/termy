import { createApp } from 'vue'
import store from "./store"
import App from './App.vue'
import './assets/tailwind.css'
import axios from 'axios'
import VueAxios from 'vue-axios'


createApp(App).use(store).use(VueAxios, axios).mount('#app')
