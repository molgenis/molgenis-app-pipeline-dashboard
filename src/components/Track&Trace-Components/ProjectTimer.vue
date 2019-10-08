<template>
    <span 
    v-if="started" class="align-middle">{{hours}}:{{minutes}}:{{seconds}}</span>
    <span v-else-if="waiting && countdown" class="align-middle">--:--:--</span>
    <span v-else class="align-middle">Not Started</span>
</template>

<script lang="ts">
import Vue from 'vue'
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
        /**
         * calculates timediffrence
         * @returns Number (milliseconds)
         */
        time(): number {
            return this.finishTime - this.startTime
        },

        /**
         * Calculates the seconds counter
         * @returns String
         */
        seconds(): string {
            const seconds = Math.sqrt(Math.pow(Math.round(((this.time / 1000) % 3600) % 60), 2))
            if (seconds < 10) {
                return '0' + seconds
            } 
            return seconds.toString()
        },

        /**
         * Calculates the minutes counter
         * @returns String
         */
        minutes(): string {
            const minutes = Math.sqrt(Math.pow(Math.round(((this.time / 1000) / 3600) % 60), 2))
            if (minutes < 10){
                return '0' + minutes
            }
            return minutes.toString()
        },

        /**
         * Calculates hour counter
         * @returns String
         */
        hours(): string {
            const hours = Math.round((this.time / 1000) / 3600)
            if (hours < 10) {
                return '0' + hours
            }
            return hours.toString()
        },
        
        /**
         * Checks if project is on hold
         * @returns Boolean
         */
        waiting(): Boolean {
            return (!this.started)
        }
        
    }  
})
</script>

<style scoped>

</style>
