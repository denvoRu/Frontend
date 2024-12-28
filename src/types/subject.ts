import { ListType } from "./list"

export type Subject = {
  rating: number,
  id: string,
  name: string,
  module_id: string
}

export type Subjects = {content: Subject[]} & ListType