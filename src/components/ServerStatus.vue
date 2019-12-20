<template>
  <div class="p-2 h-100">
    <b-table-lite class="border border-primary h-100 table" :items="tableParsedClusters" :fields="fields" small borderless>
      <template v-slot:cell(status)="data">
          <b-badge :variant="data.value.error ? 'danger' : 'success'" pill>{{data.value.error ? calculateMessage(data.value.ping) : 'Online'}}</b-badge>
      </template>
    </b-table-lite>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

interface ClusterContainer {
  ID: string;
  lastPingMinutes: number;
  error: boolean;
}

declare module 'vue/types/vue' {
  interface Vue {
    now: number;
    fields: {key: string; label: string}[];
    clusters: ClusterContainer[];
    sortedClusters: ClusterContainer[];
    calculateMessage(minutes: number): string;
    setNow(): void;

  }
}
export default Vue.extend({
  name: 'server-status',
  data () {
    return {
      now: 0,
      fields: [
        { key: 'cluster', label: 'Cluster'},
        { key: 'status', label: 'Status' }
      ]
    }
  },
  methods: {
    /**
     * Returns the last seen message
     * $ minutes ago
     * $ hours ago
     * $ days ago
     */
    calculateMessage (minutes: number): string {
      if (minutes < 60) {
        return `${minutes} minutes ago`
      }
      const hours = Math.round(minutes / 60)
      if (hours < 24) {
        return `${hours} hours ago`
      }
      return `${Math.round(minutes / 60 / 24)} Days ago`
    },
    /**
     * sets the updated time to now
     */
    setNow (): void {
      this.now = Date.now()
    }
  },
  computed: {
    ...mapState([
      'clusterPings'
    ]),
    /**
     * sorts clusters based on last ping
     */
    sortedClusters (): ClusterContainer[] {
      const clusters = this.clusters
      clusters.sort((a, b) => { return a.lastPingMinutes <= b.lastPingMinutes ? -1 : 1 })
      return clusters
    },
    /**
     * parses clusters to be displayed in bootstrap table lite
     */
    tableParsedClusters (): {cluster: string; status: { ping: number; error: boolean }}[] {
      return this.sortedClusters.map((cluster) => {
        return { cluster: cluster.ID, status: { ping: cluster.lastPingMinutes, error: cluster.error } }
      })
    },
    /**
     * formats cluster data
     * @returns {{ID: string, lastPingMinutes: number, error: boolean}[]}
     */
    clusters (): ClusterContainer[] {
      const clusterData = this.clusterPings
      const clusters = [] as ClusterContainer[]
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
  mounted (): void {
    this.setNow()
    setInterval(this.setNow, 60000)
  }
})
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
