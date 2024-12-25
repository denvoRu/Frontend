import { ListType } from "./list";

export type Teachers = ListType & {
  content: Teacher[]
}

export type Teacher = {
  name: string
  id: string
  rating: string
}