
import Vue from 'vue'
import Vuex from 'vuex'
import state from '@/store/state'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import getters from '@/store/getters'

Vue.use(Vuex)

/**
 * contains vuex Store
 * @requires actions,mutations,getters,state
 */
const Store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default Store
