export const setInstituteId = (id: string) => {
  sessionStorage.setItem('institute', id)
}
export const getInstituteId = () => {
  return sessionStorage.getItem('institute')
}
export const removeInstituteId = () => {
  sessionStorage.removeItem('institute')
}