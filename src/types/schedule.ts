export type Schedule = {
  id?: string,
  schedule_lesson_id?: string
  subject_name: string
  speaker_name: string
  lesson_name: string
  start_time: string
  end_time: string
  date: string
  tags: string[]
  rating: number
}