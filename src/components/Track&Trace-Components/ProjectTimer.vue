<template>
  <span>{{representedTimeString}}</span>
</template>

<script lang="ts">
import Vue from 'vue'
import { formatTime, calculateHours, calculateMinutes, calculateSeconds, timeUnit } from '@/helpers/time'

declare module 'vue/types/vue' {
  interface Vue {
    startTime: number;
    finishTime: number;
    started: boolean;
    time: number;
    representedTimeString: string;
    formattedHours: string;
    formattedMinutes: string;
    formattedSeconds: string;
  }
}

export default Vue.extend({
  name: 'project-timer',
  props: {
    startTime: {
      type: Number,
      required: true
    },

    finishTime: {
      type: Number,
      required: true
    },

    started: {
      type: Boolean,
      required: false,
      default: true
    }
    
  },
  computed: {
    representedTimeString (): string {
      if (isNaN(this.time)) {
        return '--:--:--'
      }
      if (this.started) {
        return this.timeString
      }
      return 'Not Started'
    },
    timeString (): string {
      return `${this.formattedHours}:${this.formattedMinutes}:${this.formattedSeconds}`
    },
    /**
     * calculates timediffrence
     *
     * @returns {Number} - milliseconds
     */
    time (): number {
      return this.finishTime - this.startTime
    },

    /**
     * Calculates the seconds counter
     *
     * @returns {String}
     */
    formattedSeconds (): string {
      return formatTime(calculateSeconds(this.time), timeUnit.seconds)
    },

    /**
     * Calculates the minutes counter
     * @returns {String}
     */
    formattedMinutes (): string {
      return formatTime(calculateMinutes(this.time), timeUnit.minutes)
    },

    /**
     * Calculates hour counter
     *
     * @returns {String}
     */
    formattedHours (): string {
      return formatTime(calculateHours(this.time), timeUnit.hours)
    }
  }
})
</script>

<style scoped>
span {
  font-size: 1vw;
}

</style>
