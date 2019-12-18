<template>
  <span>{{display}}</span>
</template>

<script lang="ts">
import Vue from 'vue'
import { formatTime, calculateHours, calculateMinutes, calculateSeconds, timeUnit } from '@/helpers/time'

declare module 'vue/types/vue' {
  interface Vue {
    startTime: number;
    finishTime: number;
    started: boolean;
    countdown: boolean;
    time: number;
    timer: string;
    hours: string;
    minutes: string;
    seconds: string;
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
    },

    countdown: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    display (): string {
      if (isNaN(this.time)) {
        return '--:--:--'
      }
      if (this.started) {
        return this.timer
      }
      if (this.waiting && this.countdown) {
        return '--:--:--'
      }
      return 'Not Started'
    },
    timer (): string {
      return `${this.hours}:${this.minutes}:${this.seconds}`
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
    seconds (): string {
      return formatTime(calculateSeconds(this.time), timeUnit.seconds)
    },

    /**
         * Calculates the minutes counter
         * @returns {String}
         */
    minutes (): string {
      return formatTime(calculateMinutes(this.time), timeUnit.minutes)
    },

    /**
         * Calculates hour counter
         *
         * @returns {String}
         */
    hours (): string {
      return formatTime(calculateHours(this.time), timeUnit.hours)
    },

    /**
         * Checks if project is on hold
         *
         * @returns {Boolean}
         */
    waiting (): boolean {
      return (!this.started)
    }

  }
})
</script>

<style scoped>
span {
  font-size: 1vw;
}

</style>
