import { ListType } from "./list";

export type Institutes = ListType & {
  content: Institute[]
}

export type Institute = {
  address: string
  id:string
  name: string
  rating: number
  short_name: string
}