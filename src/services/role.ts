export const setRole = (role: 'admin' | 'teacher') => {
  sessionStorage.setItem('role', role)
}
export const getRole = () => {
  return sessionStorage.getItem('role')
}
export const removeRole = () => {
  sessionStorage.removeItem('role')
}