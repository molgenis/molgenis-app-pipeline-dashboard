import { cropTitle, getFilteredArray} from '@/helpers/utils'

describe('cropTitle', () => {
  it('shortens given string with stated amount', () => {
    const text = 'Hello, this is a test string'

    expect(cropTitle(text, 5)).toEqual('Hello...')
  })
})

describe('getFilteredArray', () => {
  it('returns array without items that are contained in other array', () => {
    const array1 = ['test1', 'test2', 'test3']
    const array2 = ['test2', 'test3']

    expect(getFilteredArray(array1, array2)).toEqual(['test1'])
  })
})