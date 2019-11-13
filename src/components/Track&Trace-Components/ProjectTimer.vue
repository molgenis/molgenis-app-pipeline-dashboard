<template>
    <span 
    v-if="started" class="align-middle">{{hours}}:{{minutes}}:{{seconds}}</span>
    <span v-else-if="waiting && countdown" class="align-middle">--:--:--</span>
    <span v-else class="align-middle">Not Started</span>
</template>

<script>
import { formatTime, calculateHours, calculateMinutes, calculateSeconds, timeUnit} from '@/helpers/time'
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
        /**
         * calculates timediffrence
         * 
         * @returns {Number} - milliseconds
         */
        time() {
            return this.finishTime - this.startTime
        },

        /**
         * Calculates the seconds counter
         * 
         * @returns {String}
         */
        seconds() {
            return formatTime(calculateSeconds(this.time), timeUnit.seconds)
        },

        /**
         * Calculates the minutes counter
         * @returns {String}
         */
        minutes() {
            return formatTime(calculateMinutes(this.time), timeUnit.minutes)
        },

        /**
         * Calculates hour counter
         * 
         * @returns {String}
         */
        hours() {
            return formatTime(calculateHours(this.time), timeUnit.hours)
        },
        
        /**
         * Checks if project is on hold
         * 
         * @returns {Boolean}
         */
        waiting() {
            return (!this.started)
        }
        
    }  
}
</script>

<style scoped>

</style>
