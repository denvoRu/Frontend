import { Teacher } from "../types/teacher";

export function getNameByAllNames (teacher: Teacher) {
  teacher.name = `${teacher.second_name} ${teacher.first_name} ${teacher.third_name}`
  return
}