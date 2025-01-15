import { ListType } from './list';
export type FeedbackLesson = {
  date: string
  end_time: string
  id: string
  is_disabled: boolean
  lesson_name: string
  rating: number
  speaker_name: string
  start_time: string
  study_group_access: boolean
  study_group_id: string
  subject_name: string
}


export type Statistics = {
  subject_id: string
  subject_name: string
  subject_rating: number
  marks: {[key: number]: number}
  bad_tags: {name: string, count: number}[]
  good_tags: {name: string, count: number}[]
}

type Feedback = {
  id: string
  mark: number
  tags: string[]
  comment: string
  created_at: string
  extra_fields?: {question: string, answer: string}[]
}

export type FeedbackList  =  ListType & {content: Feedback[]}