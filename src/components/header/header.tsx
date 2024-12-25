import { Link } from 'react-router-dom'
import styles from './header.module.scss'

export default function Header() {
  return (
    <div className={styles.container}>
      <Link to={'/'}>
       <h2 className={styles.container__title}>Student Voice</h2>
      </Link>
      <img src='/icons/admin.svg'/>
    </div>
  )
}