<template>
  <div class="p-2 h-100">
    <b-table-lite class="border border-primary h-100 table" :items="tableParsedClusters" :fields="fields" small borderless>
      <template v-slot:cell(status)="data">
          <b-badge :variant="data.value.error ? 'danger' : 'success'" pill>{{data.value.error ? calculateMessage(data.value.ping) : 'Online'}}</b-badge>
      </template>
    </b-table-lite>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'server-status',
  data () {
    return {
      now: 0,
      fields: [
        'cluster',
        {key: 'status', label: 'Status'}
      ]
    }
  },
  methods: {
    calculateMessage(minutes) {
      if (minutes < 60) {
        return `${minutes} Minutes ago`
      }
      const hours = Math.round(minutes / 60)
      if (hours < 24) {
        return `${hours}`
      }
      return `${Math.round(minutes / 60 / 24)} Days ago`
      
    },
    setNow() {
      this.now = Date.now()
    }
  },
  computed: {
    ...mapState([
      'clusterPings'
    ]),
    sortedClusters () {
      const clusters = this.clusters
      clusters.sort((a, b) => { return a.lastPingMinutes <= b.lastPingMinutes ? -1 : 1})
      return clusters
    },
    tableParsedClusters () {
      return this.sortedClusters.map((cluster) => {
        return {cluster: cluster.ID, status: {ping: cluster.lastPingMinutes, error: cluster.error}}
      })
    },
    /**
     * @returns {{ID: string, lastPingMinutes: number, error: boolean}[]}
     */
    clusters () {
      const clusterData = this.clusterPings
      let clusters = []
      Object.keys(clusterData).forEach((cluster) => {
        const lastPing = Math.round((((this.now - clusterData[cluster].getTime()) / 60000)))
        clusters.push({
          ID: cluster,
          lastPingMinutes: lastPing,
          error: lastPing > 5
        })
      })
      return clusters
    }
  },
  mounted() {
    this.setNow()
    setInterval(this.setNow, 60000)
  }
}
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-vue/src/index.scss';

b {
  margin-right: 4px;
  margin-left: 4px;
}

.success {
    color: $success;
}
.error {
  color: $danger;
}
.table {
  font-size: 1vw;
}
</style>