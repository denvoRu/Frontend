export const updateRadioButtonList = <T extends { value: string; isActive: boolean }> (value: string, list:T[]) => {
  const newList = list.slice()
  newList.forEach((point)=> point.isActive = false)
  for (const point of newList) {
    if (point.value === value) {
      point.isActive = !point.isActive
      return newList
    }
  }
  return []
}