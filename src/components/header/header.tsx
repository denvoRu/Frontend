import { Link, useNavigate } from 'react-router-dom'
import styles from './header.module.scss'
import { getRole } from '../../services/role'
import { Icon } from '../icon'

export default function Header() {

  const navigate = useNavigate()

  const role = getRole()

  return (
    <div className={styles.container}>
      <Link to={'/'}>
       <h2 className={styles.container__title}>Student Voice</h2>
      </Link>
      <div onClick={role === 'teacher' ? ()=>navigate('/me') : undefined} className={styles.container__icon}>
        <Icon glyph={role === 'admin' ? 'admin' : 'teacher'} glyphColor='light-grey' containerStyle={styles.header__icon}/>
      </div>
    </div>
  )
}