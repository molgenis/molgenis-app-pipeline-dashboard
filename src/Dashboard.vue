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
  <b-container :key="'dashboard'" v-else id="dashboard" class="h-100" fluid>
    <b-row  no-gutters class="h-50">
      <b-col class="h-100">
        <track-and-trace
          :loadingStatus="trackingDataLoaded"
          :paused="paused"
          class="h-100 mt-1"
          @toggle-interactive-mode="togglePaused"/>
      </b-col>
    </b-row>
    <b-row no-gutters class="h-50">
      <b-col cols="12" lg="5" class="h-100 d-none d-lg-block">
        <timing-statistics :paused="paused"></timing-statistics>
      </b-col>
      <b-col cols="12" lg="5" class="h-100 d-none d-lg-block">
        <sample-statistics :paused="paused"></sample-statistics>
      </b-col>
      <b-col cols="2">
        <server-status></server-status>
      </b-col>
    </b-row>
  </b-container>
</transition-group>

</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import TrackAndTrace from '@/components/TrackAndTrace.vue'
import SampleStatistics from '@/components/SampleStatistics.vue'
import TimingStatistics from '@/components/TimingStatistics.vue'
import ServerStatus from '@/components/ServerStatus.vue'

declare module 'vue/types/vue' {
  interface Vue {
    runsLoaded: boolean;
    projectsLoaded: boolean;
    jobsLoaded: boolean;
    rawDataConverted: boolean;
    getTrackerData(): Promise<void>;
    getClusterPings(): Promise<void>;
  }
}
export default Vue.extend({
  name: 'app',
  data () {
    return {
      errorToastActive: false,
      paused: false
    }
  },
  components: {
    TrackAndTrace,
    SampleStatistics,
    TimingStatistics,
    ServerStatus
  },
  methods: {
    ...mapActions([
      'getTrackerData',
      'getClusterPings'
    ]),
    togglePaused (): void {
      this.paused = !this.paused
    },
    resumeAutoMode (): void {
      if (this.paused) {
        this.paused = false
      }
    },
    /**
     * Calls data fetch action
     *
     * @returns {Promise<void>}
     */
    getData (): void {
      this.getTrackerData()
        .then(() => {
          if (this.errorToastActive) {
            this.$bvToast.hide('errorToast')
            this.errorToastActive = false
            this.$bvToast.toast('Connection to MOLGENIS restored', {
              title: 'Updated',
              variant: 'success',
              toaster: 'b-toaster-bottom-right'
            })
          }
        })
        .catch((reason) => {
          if (!this.errorToastActive) {
            this.errorToastActive = true
            this.$bvToast.toast('Failed connecting to MOLGENIS database...', {
              id: 'errorToast',
              title: 'Error',
              variant: 'danger',
              toaster: 'b-toaster-bottom-right',
              noAutoHide: true
            })
          }
        })
    }
  },
  computed: {
    ...mapState([
      'runsLoaded',
      'projectsLoaded',
      'jobsLoaded',
      'rawDataConverted'
    ]),
    trackingDataLoaded (): boolean {
      return [this.runsLoaded, this.projectsLoaded, this.jobsLoaded, this.rawDataConverted].every(state => state)
    }
  },
  mounted (): void {
    this.getData()
    setInterval(this.getData, 10000)
    setInterval(this.getClusterPings, 30000)
    setInterval(this.resumeAutoMode, 120000)
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
