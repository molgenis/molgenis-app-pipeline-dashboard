export class DataBaseEntry {
  table: string
  identifier: string
  constructor(table: string, id: string) {
    this.table = table
    this.identifier = id
  }
}

export enum dateType {
  startedDate
}
