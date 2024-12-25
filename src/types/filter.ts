export type FilterType = {from: string, to: string, list: string[]}

export type FilterParams= {
  page?:number
  limit?: number
  desc?: number
  columns?: string
  sort?: string
  search?: string
}