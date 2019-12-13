<template>
  <span>{{display}}</span>
</template>

<script>
import { formatTime, calculateHours, calculateMinutes, calculateSeconds, timeUnit } from '@/helpers/time'
export default {
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
    display () {
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
    timer () {
      return `${this.hours}:${this.minutes}:${this.seconds}`
    },
    /**
         * calculates timediffrence
         *
         * @returns {Number} - milliseconds
         */
    time () {
      return this.finishTime - this.startTime
    },

    /**
         * Calculates the seconds counter
         *
         * @returns {String}
         */
    seconds () {
      return formatTime(calculateSeconds(this.time), timeUnit.seconds)
    },

    /**
         * Calculates the minutes counter
         * @returns {String}
         */
    minutes () {
      return formatTime(calculateMinutes(this.time), timeUnit.minutes)
    },

    /**
         * Calculates hour counter
         *
         * @returns {String}
         */
    hours () {
      return formatTime(calculateHours(this.time), timeUnit.hours)
    },

    /**
         * Checks if project is on hold
         *
         * @returns {Boolean}
         */
    waiting () {
      return (!this.started)
    }

  }
}
</script>

<style scoped>
span {
  font-size: 1vw;
}

</style>
