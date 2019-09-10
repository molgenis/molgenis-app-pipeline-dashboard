<template>
  <div id="app">
    <track-and-trace v-bind:jobs="jobs" />
  </div>
</template>

<script>
import TrackAndTrace from './components/TrackAndTrace.vue'

console.log(new Date().getTime())

export default {
  name: 'app',
  components: {
    TrackAndTrace
  },
  data () {
    return {
      jobs: [],
      time: new Date(),
      runs: [],
      fields: [
        {
          key: 'run_id',
          sortable: false
        },
        {
          key: 'progress',
          sortable: false
        },
        {
          key: 'current_step',
          sortable: false
        },
        {
          key: 'status',
          sortable: true
        },
        {
          key: 'time',
          sortable: false
        }
      ],
      counter: 0
    }
  },
  mounted () {
    this.getProjects()
  },
  methods: {
    /**
     * Get the available projects in status data.
     */
    async getProjects () {
      try {
        const response = await fetch(
          'http://localhost:8081/api/v2/status_projects',
          {
            headers: new Headers({
              'x-molgenis-token': 'admin-test-token'
            })
          }
        )

        const data = await response.json()
        const runIterator = async () => {
          for (const project of data.items) {
            await this.getRuns(project.run_id)
        }

        }
        runIterator().then(() => {
          this.jobs.sort((a,b) => {
            if (a.status === b.status) {
              return 0
            } else if (a.status === 'Waiting') {
              return 1
            } else if (a.status === 'finished' && b.status !== 'Waiting') {
              return 1
            } else if (a.status === 'Running' && b.status !== 'Waiting') {
              return 1
            } else return -1
          })
        })
  

        
        console.log('sorting')
        
        
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

    /**
     * Gets all runs available in the system.
     */
    async getRuns (runID) {
      try {
        // Get all steps - not with fixed number

        // encoding needed for correct queries
        const encodedRunID = encodeURIComponent(runID)
        const response = await fetch(
          'http://localhost:8081/api/v2/status_jobs?q=project=="' +
            encodedRunID +
            '"&num=5000',
          {
            headers: new Headers({
              'x-molgenis-token': 'admin-test-token'
            })
          }
        )

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
        let jobName = String
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

    secondsToHMS(secs) {
    function z(n){return (n<10?'0':'') + n;}
    var sign = secs < 0? '-':'';
    secs = Math.abs(secs);
    return sign + z(secs/3600 |0) + ':' + z((secs%3600) / 60 |0) + ':' + Math.round(z(secs%60));
  },
    statusComparator (a, b) {

      if (a.status === b.status) {
        return 0
      } else if (a.status === 'Running') {
        return 1
      } else {
        return -1
      }
    }
  }
}
</script>

<style>
</style>
