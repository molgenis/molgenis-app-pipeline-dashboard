<template>
    <span v-if="started" class="align-middle">{{hours}}:{{minutes}}:{{seconds}}</span>
    <span v-else-if="!started && countdown" class="align-middle">--:--:--</span>
    <span v-else class="align-middle">Not Started</span>
</template>

<script>
import Vue from 'vue'
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
         * @returns Number (milliseconds)
         */
        time: function () {
            return this.finishTime - this.startTime
        },
        /**
         * Calculates the seconds counter
         * @returns Number OR String
         */
        seconds: function () {
            const seconds = Math.sqrt(Math.pow(Math.round(((this.time/1000) % 3600) % 60), 2))
            if (seconds < 10) {
                return '0' + seconds
            } 
            return seconds
        },
        /**
         * Calculates the minutes counter
         * @returns Number OR String
         */
        minutes: function() {
            const minutes = Math.sqrt(Math.pow(Math.round(((this.time/1000) / 3600) % 60), 2))
            if (minutes < 10){
                return '0' + minutes
            }
            return minutes
        },
        /**
         * Calculates hour counter
         * @returns Number OR String
         */
        hours: function () {
            const hours = Math.round((this.time/1000) / 3600)
            if (hours < 0){
                this.$emit('negative-hours')
                return hours
            }
            else if (hours < 10) {
                return '0' + hours
            }
            return hours
        },
        /**
         * Checks if project is on hold
         * @returns Boolean
         */
        waiting: function () {
            return (!started )
        }
        
    }  
}
</script>

<style scoped>

</style>