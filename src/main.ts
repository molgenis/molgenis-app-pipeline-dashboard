import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'


import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faArrowAltCircleRight, 
  faHourglassStart, 
  faExclamationTriangle} from '@fortawesome/free-solid-svg-icons' 
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCheckCircle, faExclamationCircle, faArrowAltCircleRight, faHourglassStart, faExclamationTriangle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


new Vue({
  render: h => h(App)
}).$mount('#app')
