declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}


declare module '@molgenis/molgenis-api-client' {
  function get(url: string): Promise<any>
  function put(url: string, items: object): Promise<void>
}

declare module '@molgenis/molgenis-vue-test-utils' {
  function testAction(action: Function, {payload=null, state={}, expectedMutations=[], expectedActions=[], getters={}}: {payload: object | string, state: {}, expectedMutations: {type: any, response: any}[], expectedActions: {type: any, response: any}[], getters: object}, done: any)
}
