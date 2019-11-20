<template>
<transition-group name="fade">
  <div :key="'loader'" v-if="!trackingDataLoaded" class="d-flex justify-content-center align-items-center" style="height: 100vh; width: 100vw">
    <div class="d-flex align-items-center">
      <b-spinner variant="primary" label="Spinning"></b-spinner>
      <strong> Loading dashboard information</strong>
      <b-progress :max="3">
      <b-progress-bar :value="1"></b-progress-bar>
    </b-progress>
    </div>
  </div>
  <b-container :key="'dashboard'" v-show="trackingDataLoaded" id="dashboard" class="h-100" fluid>
    <b-row  no-gutters class="h-50">
      <b-col class="h-100">
        <track-and-trace
          :loadingStatus="trackingDataLoaded"
          class="h-100 mt-1"/>
      </b-col>
    </b-row>
    <b-row no-gutters class="h-50">
      <b-col cols="12" lg="6" class="h-100 d-none d-lg-block">
        <run-time-statistics
        />
      </b-col>
      <b-col cols="12" lg="6" class="h-100 d-none d-lg-block">
        <sample-statistics></sample-statistics>
      </b-col>
    </b-row>
  </b-container>
</transition-group>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import TrackAndTrace from '@/components/TrackAndTrace.vue'
import RunTimeStatistics from '@/components/RunTimeStatistics.vue'
import SampleStatistics from '@/components/SampleStatistics.vue'
import { responseJSON, RunTimeStatistic } from '@/types/dataTypes'
import { State } from './store/state'

declare module 'vue/types/vue' {
  interface Vue extends State{
    runTimeArray: RunTimeStatistic[]
    threshold: number
    toastCount: number
    addStatistics(run: RunTimeStatistic): void
    setThreshold(threshold: number): void
  }
}

export default Vue.extend({
  name: 'app',
  components: {
    TrackAndTrace,
    RunTimeStatistics,
    SampleStatistics
  },
  computed: {
    ...mapState([
      'runsLoaded',
      'projectsLoaded',
      'jobsLoaded',
      'rawDataConverted'
    ]),
    trackingDataLoaded () {
      return [this.runsLoaded, this.projectsLoaded, this.jobsLoaded, this.rawDataConverted].every((state) => state)
    }
  }
})

</script>

<style lang="scss">
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

.h-45 {
height: 45%;
}
.h-55 {
  height: 55%
}
.fill {

  height: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
