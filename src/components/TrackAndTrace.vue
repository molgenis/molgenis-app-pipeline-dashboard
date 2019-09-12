<template>
  <div id="track-and-trace">
    <b-table-simple hover borderless>
      <colgroup><col><col></colgroup>
      <colgroup><col><col></colgroup>
      <colgroup><col><col></colgroup>
      <b-thead head-variant="light">
        <b-tr>
          <b-th colspan="2">Run Information</b-th>
          <b-th colspan="3">Progress</b-th>
          <b-th colspan="2">Timings</b-th>
        </b-tr>
        <b-tr>
          <b-th>Run ID</b-th>
          <b-th>Pipeline</b-th>
          <b-th>Complete</b-th>
          <b-th>Current Step</b-th>
          <b-th>Status</b-th >
          <b-th>Runtime</b-th>
          <b-th>ETA</b-th>
        </b-tr>
      </b-thead>
      <b-tbody v-for="run in runs" :key="run.run_id">
          <run-item :run="run" ></run-item>
      </b-tbody>
  
    </b-table-simple>
  </div>
</template>

<script>
import runItem from './Track&Trace-Components/RunItem.vue'

export default {
  name: 'track-and-trace',
  components: {
    runItem
  },
  props: {
    headers: Headers
  },
  data () {
    return {
      loading: false,
      jobs: [],
      projects: [],
    }
  },
  computed: {
    runs: function () {
      let runs = []
      this.projects.forEach((project) => {
        let runJobs = this.jobs
        .filter(function (x) {return x.project === project.run_id})
        .sort(function (x) {return x.job})

        let run = {
          run_id: project.run_id,
          pipeline: project.pipeline,
          jobs: runJobs
        }

        runs.push(run)
      
      })

      return runs
    }
  },
  methods: {
    /**
     * Get the available projects in statßus data.
     */
    async getProjects () {
      try {
        this.projects = await this.fetchData('http://localhost:8081/api/v2/status_projects?num=10000')
        
        this.jobs = await this.fetchData('http://localhost:8081/api/v2/status_jobs?num=10000')
        
        
        /*
        runIterator().then(() => {
          this.jobs.sort((a, b) => {
            if (a.status === b.status) {
              return 0
            } else if (a.status === 'Waiting') {
              return 1
            } else if (a.status === 'finished' && b.status !== 'Waiting') {
              return 1
            } else if (a.status === 'Running' && b.status !== 'Waiting') {
              return 1
            } else if (a.status === 'not ready' && b.status !== 'Waiting'){
              return 1
            } else return -1
          })
        }).finally(() => {this.loading = false})
        */
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * Builds a run object
     * @param runID Run id to use for queries
     * @param steps Steps Array that defines total steps for completion
     * @param project Project name
     * @param status The run status e.g started, waiting, finished
     * @param step Current step
     */
    runBuilder (runID, steps, project, status, step, time) {
      var run = {}
      run.run_id = runID
      run.progress = steps
      run.current_step = step
      run.status = status
      run.time = time

      switch (status) {
        case 'finished':
          run._rowVariant = 'success'
          run.expected_finish_time = '--:--:--'
          break
        case 'Waiting':
          run._rowVariant = 'secondary'
          break
        case 'Error':
          run._rowVariant = 'danger'
          break
        case 'not ready':
          run._rowVariant = 'warning'
          break
        default:
          run._rowVariant = 'primary'
      }
      return run
    },

    async fetchData (ref, items = []) {
      const response = await fetch(ref, {headers: new Headers({'x-molgenis-token':'admin-test-token'})})
      const data = await response.json()
      let totalItems = items.concat(data.items)
      if (data.nextHref) {
        totalItems = await this.fetchData(data.nextHref, totalItems)  
      } else {
        return totalItems}
      },

    /**
     * Gets all runs available in the system.
     */
    async getRuns (runID) {
      try {
        // Get all steps - not with fixed number

        // encoding needed for correct queries
        const encodedRunID = encodeURIComponent(runID)
        const totalJobs = await fetch(
          'http://localhost:8081/api/v2/status_jobs?&num=10000',
          {
            headers: this.headers
            }).then(async function(response) {
              const data = response.json()
              if (data.nextHref) {
                await fetch(data.nextHref, this.headers).then
              }
            })
          
        

        const projectJobs = await response.json()

        const totalSteps = projectJobs.total
        const finished = await fetch(
          'http://localhost:8081/api/v2/status_jobs?q=project=="' +
            encodedRunID +
            '";status=="finished"',
          {
            headers: new Headers({
              'x-molgenis-token': 'admin-test-token'
            })
          }
        )

        const finishedSteps = await finished.json()

        let steps = []
        let completeJobList = []

        projectJobs.items.forEach(item => {
          if (!steps.includes(item.step)) {
            steps.push(item.step)
          }
          completeJobList.push({
            job: item.job,
            status: item.status,
            start: new Date(item.started_date),
            end: new Date(item.finished_date),
            completeJob: item.step
          })
        })
        completeJobList.sort()
        console.log(completeJobList)

        let timeDiffrence = '--:--:--'
        let status = 'finished'
        let jobName = 'No steps loaded'
        if (totalSteps === 0) {
          status = 'not ready'
        } else if (finishedSteps.total === 0) {
          status = 'Waiting'
          jobName = completeJobList.slice(0)[0].completeJob
        } else if (finishedSteps.total < totalSteps) {
          status = 'Running'
          timeDiffrence = this.secondsToHMS((new Date() - completeJobList.slice(0)[0].start) / 1000)
          let waitingJobs = []
          for (let job of completeJobList) {
            if (job.status === 'Waiting') {
              if (!waitingJobs.includes(job.completeJob)) {
                waitingJobs.push(job.completeJob)
              }
            }
            jobName = waitingJobs.slice(0)[0]
          }
        } else if (finishedSteps.total === totalSteps) {
          status = 'finished'
          timeDiffrence = this.secondsToHMS((completeJobList.slice(-1)[0].end - completeJobList.slice(0)[0].start) / 1000)
          jobName = completeJobList.slice(-1)[0].completeJob
        }
        let progress = {
          total: totalSteps,
          current: finishedSteps.total
        }
        this.jobs.push(
          this.runBuilder(runID, progress, runID, status, jobName, timeDiffrence)
        )
      } catch (error) {
        console.error(error)
      }
      return 0
    },
    secondsToHMS (seconds) {
      function z (n) {
        return (n < 10 ? '0' : '') + n
      }
      var sign = seconds < 0 ? '-' : ''
      seconds = Math.abs(seconds)
      return sign + z(seconds / 3600 | 0) + ':' + z((seconds % 3600) / 60 | 0) + ':' + Math.round(z(seconds % 60))
    },   
  },

  mounted () {
    this.getProjects()
  }
}

</script>

<style scoped>
</style>
