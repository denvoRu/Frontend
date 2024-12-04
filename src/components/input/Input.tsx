import styles from './input.module.scss'

type InputProps = {
  placeholder?: string
  required?: boolean
  type?: 'email' | 'password'
  value: string
  onChange: (value: string) => void
}

export default function Input ({placeholder, value, required, type, onChange}:InputProps) {
  return (
    <input type={type} required={required} className={styles.input} placeholder={placeholder} value={value} onChange={(e)=>{onChange(e.target.value)}}/>
  )
}