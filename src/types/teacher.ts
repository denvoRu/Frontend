import { ListType } from "./list";

export type Teachers = ListType & {
  content: Teacher[]
}

export type Teacher = {
  first_name: string
  second_name: string
  third_name: string
  name: string
  id: string
  email:string
  rating: number
}

export type Privilege = 'rating' | 'comments'