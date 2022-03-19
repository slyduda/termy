import { createApp } from 'vue'
import store from "./store"
import App from './App.vue'
import './assets/tailwind.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { library } from "@fortawesome/fontawesome-svg-core";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import { faFistRaised } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faTrashCanArrowUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faHeart)
library.add(faTrashCan, faTrashCanArrowUp)
library.add(faPlus)
library.add(faLock)
library.add(faGear)
library.add(faChartPie)
library.add(faCircleExclamation)
library.add(faCaretDown)
library.add(faTriangleExclamation)
library.add(faQuestionCircle)
library.add(faInfoCircle)
library.add(faBackspace)
library.add(faFistRaised);

console.log(process.env)

createApp(App).component("font-awesome-icon", FontAwesomeIcon).use(store).use(VueAxios, axios).mount('#app')
axios.defaults.baseURL = process.env.VUE_APP_API_URL
