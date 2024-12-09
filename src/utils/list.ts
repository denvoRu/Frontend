export const updateRadioButtonList = (value: string, list:{value:string, isActive: boolean}[]) => {
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