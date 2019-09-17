<template>
    <p v-if="started">{{hours}}:{{minutes}}:{{seconds}}</p>
    <p v-else>Not Started</p>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
    name: 'run-timer',
    props: {
        startTime: Number,
        finishTime: Number,
        started: Boolean
    },
    computed: {
        time: function () {
            return this.finishTime - this.startTime
        },
        seconds: function () {
            return Math.round(((this.time/1000) % 3600) % 60)
        },
        minutes: function() {
            return Math.round(((this.time/1000) / 3600) % 60)
        },
        hours: function () {
            return Math.round((this.time/1000) / 3600)
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