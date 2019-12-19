declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '@molgenis/molgenis-api-client' {
  function get(url: string): Promise<any>
  function put(url: string, items: object): Promise<void>
}
