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
        time: function () {
            return this.finishTime - this.startTime
        },
        seconds: function () {
            const seconds = Math.sqrt(Math.pow(Math.round(((this.time/1000) % 3600) % 60), 2))
            if (seconds < 10) {
                return '0' + seconds
            } 
            return seconds
        },
        minutes: function() {
            const minutes = Math.sqrt(Math.pow(Math.round(((this.time/1000) / 3600) % 60), 2))
            if (minutes < 10){
                return '0' + minutes
            }
            return minutes
        },
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
        waiting: function () {
            return (!started )
        }
        
    },
    methods: {
    },
    mounted () {
    }
    
})
</script>

<style scoped>

</style>