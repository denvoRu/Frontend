import { Teacher } from "../types/teacher";

export function getNameByAllNames (teacher: Teacher) {
  teacher.name = `${teacher.first_name} ${teacher.second_name} ${teacher.third_name}`
  return
}