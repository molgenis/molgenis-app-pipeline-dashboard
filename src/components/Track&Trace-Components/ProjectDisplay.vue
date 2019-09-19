<template>
    <div>
        <template v-for="(project, index) in run.projects">
          <project-row v-if="index == DisplayIndex" :key="project.project" :project="project.project" :jobs="project.jobs" :header="true" :runID="run.run_id" :projectCount="run.len" :time="time"></project-row>
        </template>
    </div>
</template>

<script>
import ProjectRow from './ProjectRow.vue'
export default {
    name: 'project-display',
    components: {
        ProjectRow
    },
    props: {
        run: Object
    },
    data () {
        return {
            DisplayIndex: 0
        }
    },
    computed: {
        projectCount: function() {
            return this.run.len
        }
    },
    methods: {
        cycleDisplay () {
            this.DisplayIndex += 1
            if (this.projectCount < this.DisplayIndex) {
                this.DisplayIndex = 0
            }
        }
    },
    mounted () {
        setInterval(this.cycleDisplay, 8000)
    }
}
</script>