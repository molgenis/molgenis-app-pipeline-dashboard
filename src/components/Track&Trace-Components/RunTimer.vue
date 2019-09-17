<template>
    <p v-if="started">{{hours}}:{{minutes}}:{{seconds}}</p>
    <p v-else-if="!started && countdown">--:--:--</p>
    <p v-else>Not Started</p>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
    name: 'run-timer',
    props: {
        startTime: Number,
        finishTime: Number,
        started: Boolean,
        countdown: Boolean
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
})
</script>

<style scoped>

</style>