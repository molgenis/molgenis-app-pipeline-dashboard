import testState from '../testState'
import {formatDate} from '../../../../src/helpers/dates'
import {getRunData} from '../../../../src/store/actions'

jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    get: (url: string) => {
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
  }
})

describe('store', () => {
  describe('actions', () => {
    afterEach(() => {
      // td.reset()
    })

    describe('getRunData', () => {
      it('should fetch run data', done => {
        const date = new Date()
        date.setMonth(date.getMonth() - 1)
        const dateQuery = formatDate(date)
        // td.when(get(`api/v2/${testState.overviewTable}?num=10000&q=date=gt=${dateQuery}`))
        // .thenResolve(response)
        // td.replace(api, 'get', get)
        const commit = jest.fn()
        const response = getRunData({commit, state: testState})
        response.then(() => {
          expect(commit).toHaveBeenCalledWith('runsLoaded')
          done()
        })
      })
    })
  })

})