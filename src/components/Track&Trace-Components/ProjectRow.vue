<template>
    <b-tr>
        <b-th v-if="header" class="align-middle" :rowspan="projectCount">{{runID}}</b-th>
        <b-td :variant="variant" class="align-middle">{{project}}</b-td>
        <b-td :variant="variant" class="align-middle"><run-timer :startTime="startTime" :started="started" :finishTime="finishTime" :countdown="false"></run-timer></b-td>
        <b-td v-if="finished" :variant="variant" class="align-middle">00:00:00</b-td>
        <b-td v-else :variant="variant" class="align-middle"><run-timer :startTime="finishTime" :finishTime="startTime + avgMs" :countdown="true" :started="started" v-on:negative-hours="hoursNegative"></run-timer></b-td>
        <b-td :variant="variant" class="align-middle"><progress-bar v-on:finished="projectFinished" :step="steps" :totalSteps="totalSteps" :noWarning="noWarning" :error="false"></progress-bar></b-td>
        <b-td v-if="noWarning" :variant="variant" class="align-middle">{{status}}</b-td>
        <b-td v-else :variant="variant" class="align-middle">Warning: Runtime longer than expexted</b-td>
    </b-tr>
</template>

<script>
import Vue from 'vue'
import runItem from './RunItem.vue'
import progressBar from './ProgressBar.vue'
import runTimer from './RunTimer.vue'

export default Vue.extend({
    name: 'project-row',
    props: {
        header: Boolean,
        project: String,
        jobs: Array,
        runID: String,
        projectCount: Number,
        time: Number
    },
    components: {
        progressBar,
        runTimer
    },
    data () {
        return {
            variant: 'warning',
            avgHours: 4,
            noWarning: true
            
        }
    },
    computed: {
        avgMs: function () {
            return this.avgHours * 3600 * 1000
        },
        steps: function () {
            return this.jobs.filter(function (x) {return x.status === 'finished'}).length
        },
        totalSteps: function () {
            return this.jobs.length
        },
        status: function () {
        if (this.finished) {
            this.variant = 'success'
            return 'Finished'
        } else if (!this.started) {
            this.variant = 'secondary'
            return 'Waiting'
        } else if (this.steps !== this.totalSteps) {
            this.variant = 'primary'
            return 'Running'
        }
        },

        started: function() {
            return this.steps !== 0
        },
        finished: function () {
            return this.steps/this.totalSteps === 1
        },
        finishTime: function() {
            let finished_date = 0
            if (this.finished) {
                this.jobs.forEach((job) => {
                    let currentjob = new Date(job.finished_date).getTime()
                    if (finished_date < currentjob && !isNaN(finished_date)) {
                        finished_date = currentjob
                    }
                })
                return finished_date
            } else {
                return this.time
            }
        },
        startTime: function() {
            let started_date = Infinity
            this.jobs.forEach((job) => {
                let currentjob = new Date(job.started_date).getTime()
                if (started_date > currentjob && !isNaN(started_date)) {
                    started_date = currentjob
                }
            })
            return started_date
        }

    },
    methods: {
        compareFinishedDate(a,b) {
            const DateA = new Date(a.finished_date).getTime()
            const DateB = new Date(b.finished_date).getTime()
            if (DateA < DateB) {
                return 1
            }
            if (DateA > DateB) {
                return -1
            }
            return 0
        },
        compareStartedDate(a,b) {
            
            const DateB = new Date(b.started_date).getTime()
            if (DateA > DateB) {
                return 1
            }
            if (DateA < DateB) {
                return -1
            }
            return 0
        },
        projectFinished() {
            this.$emit('finished')
        },
        hoursNegative() {
            if (!this.finished) {
                this.variant = 'warning'
                this.noWarning = false
            }
        }
    },
    mounted () {
    }
})
        
</script>
