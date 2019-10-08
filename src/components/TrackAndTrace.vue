<template>
    <b-row id="track-and-trace" no-gutters>
      <b-col  class="p-2" lg="4" cols="12">
        <b-container fluid class="border border-primary h-100 p-0">
          <run-status-table
          @run-finished="addRunToStatistics"
          :total-runs="runSteps"
          :selected-run="showRun"
          @select-run="setShowRun"
          @toggle-cycle="toggleCycle"
          :cycle-paused="paused"
          class="w-100">
          </run-status-table>
        </b-container>
      </b-col>
    <b-col class="p-2" cols="12" lg="8">
      <b-container class="border border-primary h-100" fluid>
      <transition name="fade" mode="out-in">
        <run-table
        :runID="runID"
        :showRun="showRun"
        :projects="runProjects"
        :projectCount="projectCount"
        :containsError="containsError"
        :currentStep="currentStep"
        :time="time"
        :demultiplexing="demultiplexing"/>
      </transition>
      </b-container>
    </b-col>
    </b-row>
</template>

<script lang="ts">
import Vue from 'vue'
import RunTable from '@/components/Track&Trace-Components/RunTable.vue'
import RunStatusTable from '@/components/Track&Trace-Components/RunStatusTable.vue'
import projectComponent from '@/components/Track&Trace-Components/RunTableProject.vue'


interface RawDataObject extends RunDataObject, projectDataObject, Job{

}

class Run {
  run_id: string
  projects: projectObject[]
  demultiplexing: string
  rawCopy: string
  len: number
  containsError: Boolean
  copyState: number
  constructor(runID: string, projectArray: projectObject[], Demultiplexing: string, RawCopyState: string, lenght: number, error: Boolean, ResultCopyState: number){
    this.run_id = runID
    this.projects = projectArray
    this.demultiplexing = Demultiplexing
    this.rawCopy = RawCopyState
    this.len = lenght
    this.containsError = error
    this.copyState = ResultCopyState
  }
}

interface RunDataObject {
  run_id: string
  group: string
  demultiplexing: string
  copy_raw_prm: string
  projects: string[]
}
 
class projectObject {
  project: string
  jobs: Array<Job>
  pipeline: string
  resultCopyStatus?: string 
  status: string
  constructor(projectName: string, jobArray: Job[], pipelineType: string, statusString: string, resultCopyStatusString: string | undefined){
    this.project = projectName
    this.jobs = jobArray
    this.pipeline = pipelineType
    this.resultCopyStatus = resultCopyStatusString
    this.status = statusString
  }
}

interface projectDataObject{
  project: string
  url: string
  run_id: string
  pipeline: string
  copy_results_prm?: string
}

interface Job {
  project_job: string
  job: string
  project: string
  url: string
  status: string
  step: string
  started_date?: string
  finished_date?: string
}

interface Step {
  run: string
  step: number
  containsError: Boolean
  len: number
}

export default Vue.extend({
  name: 'track-and-trace',
  components: {
    RunTable,
    RunStatusTable
  },
  props: {
    headers: {
      type: Headers,
      required: true
    },

    url: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      runs: [] as RunDataObject[],
      jobs: [] as Job[],
      projects: [] as projectDataObject[],

      runUrl: '',
      time: 0,

      showRun: '',
      paused: false,
      loading: false
    }
  },
  computed: {
    /**
     * Currently selected run
     * @returns Object run
     */
    run(): Run {
      const run = this.runData.find((x: Run) => { return x.run_id === this.showRun })
      if (run) {
        return run!
      }
      return new Run('', [], '', '', 0, false, 0)
    },

    /**
     * Currently selected run id
     * @returns String run id
     */
    runID(): string {
      const runID = this.run.run_id
      if (typeof (runID) === undefined) {
        return ''
      }
      return this.run.run_id
    },

    /**
     * Currently selected run projects
     * @returns Array of Projects
     */
    runProjects(): Array<projectObject> {
      return this.run.projects
    },

    /**
     * Currently selected run project count
     * @returns Number of projects
     */
    projectCount(): number {
      return this.run.len + 1
    },

    /**
     * Currently selected run error status
     * @returns Boolean
     */
    containsError (): Boolean {
      return this.run.containsError
    },

    demultiplexing(): Boolean {
      const demultiplexing = this.run.demultiplexing

      return demultiplexing === 'started' || demultiplexing === 'finished'
    },
    /**
     * Currently selected run step
     * @returns Number step
     */
    currentStep(): number {
      return this.runStep(this.run)
    },

    /**
     * Combines all data into one object
     * @returns Object
     */
    runData(): Run[] {
      let data: Run[] = []
      this.runs.forEach((run: RunDataObject) => { data.push(this.constructRun(run, this.projects, this.jobs)) })
      data = data.sort(this.sortRuns)
      return data
    },

    /**
     * Creates array of runId Strings
     * @returns Array
     */
    runIds(): string[] {
      let runIds: string[] = []
      this.runs.forEach((run: RunDataObject) => {
        runIds.push(run.run_id)
      })
      return runIds
    },

    /**
     * creates an Array of run objects for step tracker
     * @returns Array
     */
    runSteps (): Step[] {
      let runSteps: Step[] = []
      this.runData.forEach((run) => {
        runSteps.push(
          {
            run: run.run_id,
            step: this.runStep(run),
            containsError: run.containsError,
            len: run.len
          }
        )
      })
      return runSteps
    }
  },
  methods: {
    /**
     * changes detailed view to the given index
     * @param index Number
     */
    setCurrentIndex (index: number): void {
      this.showRun = this.runIds[index]
    },

    /**
     * run comparator function
     * @param run1 run 1
     * @param run2 run 2
     * @returns Number
     */
    sortRuns (run1: Run, run2: Run): number {
      if (run1.containsError && !run2.containsError) {
        return -1
      } else if (run2.containsError) {
        return 1
      } else if (this.runStep(run1) > this.runStep(run2)) {
        return 1
      } else {
        return 0
      }
    },

    /**
     * pauses the run cycleRun when selecting a run
     * @param run run to select
     */
    setShowRun (run: string): void {
      this.paused = true
      this.showRun = run
    },

    /**
     * increases timer by 1 second
     */
    timeUp (): void {
      this.time = this.time + 1000
    },

    /**
     * primes the timer for counting runtimes
     */
    setTimer ():void {
      this.time = new Date().getTime()
      setInterval(this.timeUp, 1000)
    },

    /**
     * Get the available projects in status data.
     */
    async getData (): Promise<void> {
      try {
        let runs: RunDataObject[] = await this.fetchData(this.url + 'status_overview?num=10000')
        let projects: projectDataObject[] = await this.fetchData(this.url + 'status_projects?num=10000')
        let jobs: Job[] = await this.fetchData(this.url + 'status_jobs?num=10000')

        if (jobs !== this.jobs) {
          this.jobs = jobs
        }
        if (projects !== this.projects) {
          this.projects = projects
        }
        if (runs !== this.runs) {
          this.runs = runs
        }
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * fetches data from specified location
     * @param ref fetch location url
     * @returns Array of items
     */
    async fetchData (ref: string, items: Array<RawDataObject> = []): Promise<Array<RawDataObject>> {
      const response = await fetch(ref, {
        headers: this.headers
      })

      const data = await response.json()
      let totalItems = items.concat(data.items)
      if (data.nextHref) {
        totalItems = await this.fetchData(data.nextHref, totalItems)
      }
      return totalItems
    },

    /**
     * Cycles the display index by 1
     */
    cycleRun (): void {
      if (!this.paused) {
        let currentIndex = this.runIds.indexOf(this.showRun)
        if (currentIndex === (this.runIds.length - 1)) {
          currentIndex = 0
        } else {
          currentIndex += 1
        }
        this.showRun = this.runIds[currentIndex]
      }
    },

    /**
     * finds run status step number
     * @param run run to check
     * @returns step Number
     */
    runStep (run: Run): number {
      switch (run.demultiplexing) {
        case 'started':
          return 0
        case 'Waiting':
          return -1
      
        default:
      }
      if (run.rawCopy === 'started') {
        return 1
      } else if (run.copyState === (run.len)) {
        return 4
        // run result copying check
      } else if (run.copyState > 0 && this.runFinished(run)) {
        return 3
      } else {
        return 2
      }
    },

    /**
     * pause or resume cycling of detailed view
     */
    toggleCycle (): void {
      this.paused = !this.paused
    },

    /**
     * filters projects that are linked to run
     * @param projects all projects
     * @param run run to add data
     * @returns filtered projects
     */
    getRunProjects (projects: projectDataObject[], run: string): projectDataObject[] {
      return projects.filter(function (x) {
        return x.run_id === run
      })
    },

    /**
     * filters jobs that are linked to project
     * @param jobs all jobs
     * @param project project to add data to
     * @returns project jobs
     */
    getProjectJobs (jobs: Job[], project: projectDataObject): Job[] {
      return jobs
        .filter(function (x: Job) {
          return x.project === project.project
        })
        .sort(function (a: Job, b: Job) {
          if  (a.job > b.job) {
            return 1
          } else if (a.job < b.job) {
            return -1
          } else {
            return 0
          }
        })
    },

    /**
     * Checks if a run is finished with its pipelines
     * @param run Object
     * @returns Boolean
     */
    runFinished (run: Run): Boolean {
      return run.projects.filter((x) => { return x.status.toLowerCase() === 'finished' }).length === run.len
    },

    /**
     * makes run data objects
     * @param run run information
     * @param Projects projects connected to run
     * @param errors error count of jobs
     * @returns Object
     */
    makeRunObject (run: RunDataObject, Projects: projectObject[], errors: number): Run {
      let runObject = new Run(run.run_id, Projects, run.demultiplexing, run.copy_raw_prm, Projects.length, errors >= 1, this.countProjectFinishedCopying(Projects))
      return runObject
    },

    /**
     * returns number of finished projects
     * @param projects projects to check
     * @returns Number
     */
    countProjectFinishedCopying (projects: projectObject[]): number {
      const finishedProjects = projects.filter(function (x) {
        return x.resultCopyStatus === 'finished'
      })
      return finishedProjects.length
    },

    /**
     * combines all available data into one run
     * @param run run to add data to
     * @param projects all projects to filter
     * @param jobs all jobs to filter
     * @returns runObject
     */
    constructRun (run: RunDataObject, projects: Array<projectDataObject>, jobs: Array<Job>): Run {
      let Projects: projectObject[] = []
      const runProjects = this.getRunProjects(projects, run.run_id)
      let errors = 0
      runProjects.forEach((RunProject: projectDataObject) => {
        const ProjectJobs = this.getProjectJobs(jobs, RunProject)
        Projects.push(this.makeProjectObject(
          RunProject,
          ProjectJobs,
          this.getStatus(RunProject, ProjectJobs)
        ))
        errors += this.countJobStatus(ProjectJobs, 'error')
      })
      return this.makeRunObject(run, Projects, errors)
    },

    /**
     * gets the project status
     * @param project project
     * @param jobs project jobs
     * @returns String status
     */
    getStatus (project: projectDataObject, jobs: Job[]): string {
      if (project.copy_results_prm === 'finished') {
        return 'finished'
      } else if (this.countJobStatus(jobs, 'finished') === jobs.length) {
        return 'finished'
      } else if (this.countJobStatus(jobs, 'started') >= 1) {
        return 'started'
      } else {
        return 'Waiting'
      }
    },

    /**
     * builds project Object
     * @param project project
     * @param jobs project jobs
     * @returns project Object
     */
    makeProjectObject (project: projectDataObject, jobs: Job[], status: string): projectObject {
      let buildProject = new projectObject(project.project, jobs, project.pipeline, status, project.copy_results_prm)

      return buildProject
    },

    /**
     * Coutns status occurence in a job Array
     *
     * @returns status count Number
     */
    countJobStatus (jobs: Job[], status: string): number {
      return jobs.filter(function (x) { return x.status === status }).length
    },
    findLastDateTime (projects: projectObject[]): number {
      let FinishedDate = 0
      projects.forEach((project: projectObject) => {
        project.jobs.forEach((job: Job) => {
          if (typeof (job.finished_date) !== undefined) {
            let CurrentJobDate = new Date(job.finished_date!).getTime()
            if (FinishedDate < CurrentJobDate && !isNaN(FinishedDate)) {
              FinishedDate = CurrentJobDate
            }
          }
        })
      })
      return FinishedDate
    },
    findStartDateTime (projects: projectObject[]): number {
      let StartedDate = Infinity
      projects.forEach((project: projectObject) => {
        project.jobs.forEach((job: Job) => {
          if (typeof (job.started_date) !== undefined) {
            let CurrentJobDate = new Date(job.started_date!).getTime()
            if (StartedDate > CurrentJobDate && !isNaN(StartedDate)) {
              StartedDate = CurrentJobDate
            }
          }
        })
      })
      return StartedDate
    },
    addRunToStatistics (run: string): void {
      const runStats = this.runData.find((x: Run) => {
        return x.run_id === run
      })
      const start = this.findStartDateTime(runStats!.projects)
      const finish = this.findLastDateTime(runStats!.projects)
      this.$emit('add-statistic', run, start, finish)
      
    }
  },

  mounted (): void {
    this.getData()
    this.setTimer()
    setInterval(this.getData, 10000)
    this.cycleRun()
    setInterval(this.cycleRun, 10000)
  }
})

</script>

<style lang="scss" scoped>
@import '../../node_modules/bootstrap/scss/bootstrap';
@import '../../node_modules/bootstrap-vue/src/index.scss';

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.run_id {
  border: 2px solid $secondary;
}

.height60 {
  height: 100%;
}
</style>
