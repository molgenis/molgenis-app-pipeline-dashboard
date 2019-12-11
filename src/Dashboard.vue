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
          class="h-100 mt-1"/>
      </b-col>
    </b-row>
    <b-row no-gutters class="h-50">
      <b-col cols="12" lg="6" class="h-100 d-none d-lg-block">
        <timing-statistics></timing-statistics>
      </b-col>
      <b-col cols="12" lg="6" class="h-100 d-none d-lg-block">
        <sample-statistics></sample-statistics>
      </b-col>
    </b-row>
  </b-container>
</transition-group>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import TrackAndTrace from '@/components/TrackAndTrace.vue'
import RunTimeStatistics from '@/components/RunTimeStatistics.vue'
import SampleStatistics from '@/components/SampleStatistics.vue'
import TimingStatistics from '@/components/TimingStatistics.vue'
import { responseJSON, RunTimeStatistic } from '@/types/dataTypes'

export default {
  name: 'app',
  data () {
    return {
      errorToastActive: false
    }
  },
  components: {
    TrackAndTrace,
    RunTimeStatistics,
    SampleStatistics,
    TimingStatistics
  },
  methods: {
    ...mapActions({
      refresh: 'getTrackerData',
      clusterPings: 'getClusterPings'
    }),
     /**
     * Calls data fetch action
     *
     * @returns {Promise<void>}
     */
    getData () {
      this.refresh(20)
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
            this.$bvToast.toast(reason, {
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
    trackingDataLoaded () {
      return [this.runsLoaded, this.projectsLoaded, this.jobsLoaded, this.rawDataConverted].every(state => state)
    }
  },
  async mounted () {
    await this.getData()
    this.clusterPings
    setInterval(this.getData, 10000)
    setInterval(this.clusterPings, 30000)

  }
}
</script>

<style lang="scss">
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

body {
  font-size: 1em;

  @media(min-width: 85.375em) {
    font-size: 1.2em;
  }
  @media(min-width: 120em) {
    font-size: 1.4em;
  }
  @media(min-width: 160em) {
    font-size: 2em;
  }
}

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
