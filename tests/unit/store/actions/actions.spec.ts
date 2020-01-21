import testState from '../testState'
import {formatDate} from '../../../../src/helpers/dates'
import {
  getRunData,
  getTrackerData,
  findMax,
  fillToEqualLenghts,
  getProjectData,
  getSamplesInDateRange,
  handleCommentSubmit,
  convertProjects,
  getDate,
  getProjectDates,
  getClusterPings,
  getMachineData,
  getSequencerStatistics,
  getDurationStatistics,
  constructRunObjects,
  getJobAggregates
} from '../../../../src/store/actions'

import {ProjectDataObject, statusCode, dateSearch, RunDataObject} from '../../../../src/types/dataTypes'
import {ProjectData, JobCounts, JobCounter, RunData} from '../../../../src/types/Run'
import {IdentifiedSerie} from '../../../../src/types/graphTypes'
jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    get: (url: string) => {
      if (url.match(/\/api\/v2\/status_overview.+/)) {
        return Promise.resolve({
          items: [
            {
            "run_id": "test-run",
            "group": "other",
            "demultiplexing": "finished",
            "copy_raw_prm": "finished",
            "date": "2019-12-12"
            }
          ]
        })
      }
      if (url.match(/\/api\/v2\/status_projects\/.+/)) {
        return Promise.resolve({
          items: [
            {
              "project": "test-project",
              "run_id": "test-run",
              "copy_results_prm": "started",
              "pipeline": "DNA"
            }
          ]
        })
      }
      if (url.match(/\/api\/v2\/getDatesTest1.+/)) {
        return Promise.resolve({
          items: [
            {
            "started_date": "2019-09-21T19:08:20.531Z",
            "finished_date": "2019-09-22T19:08:20.531Z"
            }
          ],
          
        })
      }
      if (url.match(/\/api\/v2\/getDatesTest2.+/)) {
        return Promise.resolve({
          items: [
          ],
        })
      }
      if (url.match(/\/api\/v2\/getDatesTest3.+/)) {
        return Promise.resolve({
          items: [
            {
            "started_date": "2019-09-21T19:08:20.531Z"
            }
          ],
        })
      }
      if (url.match(/\/api\/v2\/getDatesTest4.+/)) {
        return Promise.reject(new Error('Bad request'))
      }
      if (url.match(/\/api\/v2\/clusterPings1.*/)) {
        return Promise.resolve({
          items: [
            {
            "cluster_name": "testCluster",
            "latest_ping_timestamp": "2019-09-21T19:08:20.531Z"
            }
          ]
        })
      }
      if (url.match(/\/api\/v2\/clusterPings2.*/)) {
        return Promise.reject(new Error('Bad request'))
      }
      if (url.match(/\/api\/v2\/machineData1.*testMachine1.*/)) {
        return Promise.resolve({
          items: [
            {
              "project": 'testProject',
              "total_hours": 10
            },
            {
              "project": 'testProject2',
              "total_hours": 3
            },
            {
              "project": 'testProject3',
              "total_hours": 9
            },
          ]
        })
      }
      if (url.match(/\/api\/v2\/machineData1.*testMachine2.*/)) {
        return Promise.resolve({
          items: [
            {
              "project": 'testProject4',
              "total_hours": 5
            },
            {
              "project": 'testProject5',
              "total_hours": 6
            },
            {
              "project": 'testProject6',
              "total_hours": 7
            },
          ]
        })
      }
      if (url.match(/\/api\/v2\/sequencer1.+/)) {
        return Promise.resolve({
          aggs: {
            "matrix": [
              [1, 2],
              [2, 1]
          ],
          "xLabels": [
            "testRow1",
            "testRow2"
        ]
          }
        })
      }
      if (url.match(/\/api\/v2\/sequencer2.+/)) {
        return Promise.reject(new Error('Bad request'))
      }
      if (url.match(/\/api\/v2\/duration1.+/)) {
        return Promise.resolve({
          items: [
            {
              "unique_id": "duration1-Exoom_v5",
              "copyRawDataToPrmDuration": 20,
              "pipelineDuration": 50,
              "copyProjectDataToPrmTiming": 10,
              "total_min": 60,
              "finishedTime": "2019-01-21T21:20:47.591Z"
            },
            {
              "unique_id": "duration2-Exoom_v5",
              "copyRawDataToPrmDuration": 21,
              "pipelineDuration": 53,
              "copyProjectDataToPrmTiming": 11,
              "total_min": 62,
              "finishedTime": "2019-01-22T21:20:47.591Z"
            }
          ]
        })
      }
      if (url.match(/\/api\/v2\/jobs1.+/)) {
        return Promise.resolve({
          aggs: {
            "matrix": [
              [0, 0, 0, 2],
              [0, 2, 0, 0],
              [0, 2, 1, 0],
              [2, 0, 0, 0]
            ],
            "xLabels": [
              "waiting",
              "started",
              "error",
              "finished"
          ],
            "yLabels": [
              "finishedProject",
              "startedProject",
              "errorProject",
              "waitingProject"
            ]
          }
        })
      }

      return Promise.resolve({
        items: [],
        total: 5
      })
    }
  }
})

describe('store', () => {
  describe('actions', () => {
    let state = testState
    let api: any;
    let spy: jest.SpyInstance<any, unknown[]>;
    beforeAll(() => {
      api = require('@molgenis/molgenis-api-client')
      spy = jest.spyOn(api, 'get')
    })
    afterEach(() => {
      spy.mockClear()
      state = testState
    })
    describe('getTrackerData', () => {
      it('should call all track and trace actions (5 times)', done => {
      const dispatch = jest.fn((action: string, params?: object) => {return Promise.resolve([])})
      const result = getTrackerData({dispatch})
      result.then(() => {
        expect(dispatch).toBeCalledTimes(5)
        done()
      })
      
    })
    it('Should throw an error after no response was given for the runs', done => {
      const dispatch = jest.fn((action: string, params?: object) => {return action == 'getRunData' ? Promise.reject('404') : Promise.resolve([])})
      const result = getTrackerData({dispatch})
      result.catch((error: Error) => {
        expect(error).toEqual(new Error('Could not retrieve Track&Trace data from MOLGENIS!'))
        expect(dispatch).toBeCalledTimes(1)
      })
      done()
    })
    it('Should throw an error after no response was given for the projects, jobAggragetes or clusterPings', done => {
      const dispatch = jest.fn((action: string, params?: object) => {return action != 'getRunData' ? Promise.reject('404') : Promise.resolve([])})
      const result = getTrackerData({dispatch})
      result.catch((error: Error) => {
        expect(error).toEqual(new Error('Could not retrieve Track&Trace data from MOLGENIS!'))
        expect(dispatch).toBeCalledWith('getRunData')
      })
      done()
    })
    
    })

    describe('getRunData', () => {
      it('should fetch run data', done => {
        const commit = jest.fn()
        const response = getRunData({commit, state: testState})
        response.then(() => {
          expect(commit).toHaveBeenCalledWith('runsLoaded')
          done()
        })
      })

      it('Should throw an error after no response was given for the runs', done => {
        const dispatch = jest.fn((action: string, params?: object) => {return action == 'getRunData' ? Promise.reject('404') : Promise.resolve([])})
        const commit = jest.fn()
        const result = getRunData({commit, state:testState})
        result.catch((error: Error) => {
          expect(error).toEqual(new Error('Could not retrieve Track&Trace data from MOLGENIS!'))
          expect(dispatch).toBeCalledTimes(1)
        })
        done()
      })
    })
    
    describe('getProjectData', () => {
      it('resolves empty when no runs were given', done => {
        const commit = jest.fn()
        const result = getProjectData({commit, state: testState}, {runIDs: []})
        result.then((response) => {
          expect(commit).toBeCalledWith('projectsLoaded')
          expect(response).toEqual([])
        })
        done()
      })
      it('retrieves correct projects', done => {
        const commit = jest.fn()
        const result = getProjectData({commit, state: testState}, {runIDs: ['test-run', 'test-run2']})
        
        result.then(() => {
          expect(spy).toBeCalledWith('/api/v2/status_projects?num=10000&q=run_id=in=(test-run,test-run2)')
        })
        done()
      })
    })
    describe('identifiedSerieData functions/actions', () => {
      const seriesArray: IdentifiedSerie[] = []
      seriesArray.push(new IdentifiedSerie('test', [
        {projectID: 'test', number: 2},
        {projectID: 'test2', number: 21},
        {projectID: 'test3', number: 23},
      ]))
      seriesArray.push(new IdentifiedSerie('test', [
        {projectID: 'test', number: 2},
        {projectID: 'test2', number: 21},
      ]))
      it('function findMax finds correct maximum lenght', () => {
        expect(findMax(seriesArray, 0)).toBe(3)
      })
      it('function fillToEqualLenghts fills series to equal lenghts', () => {
        const newSeries: IdentifiedSerie[] = fillToEqualLenghts(seriesArray)
        expect(newSeries[0].getLength()).toEqual(newSeries[1].getLength())
      })
    })
    describe('getSamplesInDateRange', () => {
      it('gets total response', done => {
        getSamplesInDateRange({state: testState}, ['21-09-2019', '22-09-2019']).then((responseNumber) => {
          expect(responseNumber).toBe(5)
          const query = `sequencingStartDate=rng=(21-09-2019, 22-09-2019)`
          expect(spy).toHaveBeenCalledWith(`/api/v2/${testState.sampleTable}?q=${query}&num=1`)
          done()
        })
  
      })
    })

    describe('handleCommentSubmit', () => {
      let submit: {project: string; oldComment: string; newComment: string; validation: boolean };
      const dispatch = jest.fn(() => {
        return Promise.resolve('resolved')
      })
      beforeEach(() => {
        submit = {project: 'test-project', oldComment:'hey', newComment: 'how', validation: true}
        dispatch.mockClear()
      })
      it('handles comment submit', done => {
        
        handleCommentSubmit({dispatch}, submit).then(() => {
          expect(dispatch).toBeCalledWith('checkForCommentUpdates', {project: submit.project, oldComment: submit.oldComment, newComment: submit.newComment})
          done()
        })
      })
      it('does not continue when not validated', done => {
        submit.validation = false
        handleCommentSubmit({dispatch}, submit).catch((error: Error) => {
          expect(error).toEqual(new Error('Comment is invalid'))
        }).finally(() => {
          done()
        })
      })
    })

    describe('convertProjects', () => {
      it('converts Raw projects into ProjectDataObject', done => {
        const Jobs: JobCounter = new JobCounter({waiting: 0, started: 0, error: 0, finished: 5})
        const rawProject: ProjectDataObject = {
          project: 'testProject',
          url: 'url',
          run_id: 'test-run',
          pipeline: 'DNA',
          copy_results_prm: 'started',
          comment: ''
        }
        const convertedProject = new ProjectData(rawProject.project, statusCode.started, Jobs, false)
        state.jobAggregates["testProject"] = Jobs
        convertProjects({state: state}, [rawProject]).then((result) => {
          expect(result).toEqual({"test-run": [convertedProject]})
          done()
        })
      })
    })

    describe('getDate', () => {
      it('gets the started date from database', done => {
        state.jobTable = 'getDatesTest1'
        getDate({state}, {projectID: 'test-project', type: dateSearch.started}).then((result) => {
          expect(result).toBeInstanceOf(Date)
          done()
        })
      })
      it('returns undefined date when nothing returns', done => {
        state.jobTable = 'getDatesTest2'
        getDate({state}, {projectID: 'test-project', type: dateSearch.started}).then((result) => {
          expect(result).toBe(undefined)
          done()
        })
      })
      it('returns undefined date when job has not finished yet', done => {
        state.jobTable = 'getDatesTest3'
        getDate({state}, {projectID: 'test-project', type: dateSearch.finished}).then((result) => {
          expect(result).toBe(undefined)
          done()
        })
      })
        it('rejects on bad request', done => {
          state.jobTable = 'getDatesTest4'
          getDate({state}, {projectID: 'test-project', type: dateSearch.finished}).catch((error: Error) => {
            expect(error).toEqual(new Error('Bad request'))
            done()
          })
      })
    })
    describe('getProjectDates', () => {
      it('gets started and finished dates for finished jobs, and started for only started jobs', done => {
        const jobs = new JobCounter({waiting: 0, started: 2, finished: 2, error: 0})
        state.jobAggregates["project1"] = jobs
        const jobsFinished = jobs
        jobsFinished.setFinished()
        state.jobAggregates["project2"] = jobsFinished
        const fakeDate = new Date()
        const dispatch = jest.fn((action: string, params:object) => {
          return Promise.resolve(fakeDate)
        })
        const commit = jest.fn()
        getProjectDates({state, dispatch, commit}).then(() => {
          expect(dispatch).toHaveBeenCalledWith('getDate', {projectID: 'project2', type: dateSearch.started})
          expect(dispatch).toHaveBeenCalledWith('getDate', {projectID: 'project2', type: dateSearch.finished})
          done()
          expect(commit).toHaveBeenCalledWith('updateProjectDates', { projectID: 'project2', startedDate: fakeDate, finishedDate: fakeDate })
          expect(dispatch).toHaveBeenCalledWith('getDate', {projectID: 'project1', type: dateSearch.started})
          expect(dispatch).not.toHaveBeenCalledWith('getDate', {projectID: 'project1', type: dateSearch.finished})
          expect(commit).toHaveBeenCalledWith('updateProjectDates', { projectID: 'project1', startedDate: fakeDate, finishedDate: undefined })
        }).finally(done)
      })
    })

    describe('getClusterPings', () => {
      it('retrieves cluster pings', done => {
        state.clusterTable = 'clusterPings1'
        const commit = jest.fn((mutation: string, params: object[])=> {return})
        const result = getClusterPings({state, commit})
        
        result.then(() => {
          expect(commit).toBeCalledWith('updateClusterPings', [{
            "cluster_name": "testCluster",
            "latest_ping_timestamp": "2019-09-21T19:08:20.531Z"
            }])
          done()
        })
      })
      it('rejects on error', done => {
        state.clusterTable = 'clusterPings2'
        getClusterPings({state, commit: jest.fn()}).catch((error) => {
          expect(error).toEqual(new Error('Bad request'))
          
        }).finally(done)
      })
    })

    describe('getMachineData', () => {
      it('Builds equal lenght machine statistics data', done => {
        state.timingTable = 'machineData1'
        state.pipelineTypes = ['Exoom']
        let statistics: Record<string, IdentifiedSerie[]> = {}
        //@ts-ignore sorry :(
        const commit = jest.fn((mutation: string, params: object) => {statistics = params})
        
        const result = getMachineData({commit, state}, {machines: ['testMachine1', 'testMachine2'], range: 10})
        result.then(() => {
          expect(commit).toHaveBeenCalled()
          expect(statistics["Exoom"][0].getLength()).toEqual(statistics["Exoom"][1].getLength())
        }).finally(done)
        })
      })

    describe('getSequencerStatistics', () => {
      it('gets sequencer matrix and commits data', done => {
        state.sampleTable = 'sequencer1'
        const commit = jest.fn()
        getSequencerStatistics({commit, state}).then(() => {
          expect(commit).toHaveBeenCalledWith('setSequencerStatisticsSeries', [1,2])
          expect(commit).toHaveBeenCalledWith('setSequencerStatisticsLabels', ["testRow1",
          "testRow2"])
        }).finally(() => {
          done()
        })
      })
      it('rejects with an error when failed', done => {
        state.sampleTable = 'sequencer2'
        const commit = jest.fn()
        getSequencerStatistics({commit, state}).catch((error) => {
          expect(error).toBeInstanceOf(Error)
          
        }).finally(() => {
          done()
        })
    })
  })
  describe('getDurationStatistics', () => {
    it('gets duration statistics and commits results', done => {
      state.timingTable = 'duration1'
      const commit = jest.fn()
      getDurationStatistics({state, commit}).then(() => {
        expect(commit).toHaveBeenCalledTimes(2)
        
      }).finally(()=> {
        done()
      })
    })
  })
  describe('constructRunObjects', () => {
    it('Converts raw runs to run objects', done => {
      const commit = jest.fn()
      const jobs = new JobCounter({waiting: 2, started: 0, finished: 0, error: 0})
      const projects: Record<string, ProjectData[]> = {
      "testRun1": [
        new ProjectData('testProject1', statusCode.waiting, jobs, false),
        new ProjectData('testProject2', statusCode.waiting, jobs, false),
        new ProjectData('testProject3', statusCode.waiting, jobs, false)
      ]
    }

      const runs: RunDataObject[] = [
        {
          run_id: 'testRun1',
          group: 'other',
          demultiplexing: 'started',
          copy_raw_prm: 'waiting',
          projects: []
        }
      ] 
      constructRunObjects({commit}, {runs, projects}).then(() => {
        expect(commit).toHaveBeenCalled()
      }).finally(() => {
        done()
      })
    })
  })

  describe('getJobAggregates', () => {
    it('gets and construcst the resulting jobCounters', done => {
      state.jobTable = 'jobs1'
      let jobResults: Record<string, JobCounts> = {}
      let mutation = ''
      const commit = jest.fn((mutation: string, params: object) => {
        //@ts-ignore ....
        jobResults = params
        mutation = mutation
      })
      getJobAggregates({commit, state}).then(() => {
        expect(mutation).toBe('setJobAggregates')
        expect(jobResults["finishedProject"].getStatus()).toBe(statusCode.finished)
        expect(jobResults["startedProject"].getStatus()).toBe(statusCode.started)
        expect(jobResults["errorProject"].getStatus()).toBe(statusCode.error)
        expect(jobResults["waitingProject"].getStatus()).toBe(statusCode.waiting)
      }).finally(() => {
        done()
      })
    })
  })
})
})