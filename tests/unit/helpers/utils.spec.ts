import { cropTitle, getFilteredArray} from '@/helpers/utils'

describe('cropTitle', () => {
  test('shortens given string with stated amount', () => {
    const text = 'Hello, this is a test string'

    expect(cropTitle(text, 5)).toEqual('Hello...')
  })

  test('string is already smaller than given lenght', () => {
    const text = 'test' // lenght 4

    expect(cropTitle(text, 4)).toEqual(text)
  })
})

describe('getFilteredArray', () => {
  test('returns array without items that are contained in other array', () => {
    const array1 = ['test1', 'test2', 'test3']
    const array2 = ['test2', 'test3']

    expect(getFilteredArray(array1, array2)).not.toContain(['test2','test3'])
  })
})