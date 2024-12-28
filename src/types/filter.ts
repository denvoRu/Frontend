export type FilterType = {rating_start: string, rating_end: string, list: {name: string, id: string}[]}

export type FilterParams= {
  page?:number
  limit?: number
  desc?: number
  columns?: string
  sort?: string
  search?: string
}