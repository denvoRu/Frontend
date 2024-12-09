import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../icon'
import styles from './bottomLinks.module.scss'

export default function BottomLinks () {

  const location = useLocation()

  return (
    <div className={styles.linksBlock}>
          <div className={styles.links}>
            <Link to='/teachers' className={`${styles.links__link} ${location.pathname.includes('teachers') ? styles.links__link_active : ''}`}>
              <Icon glyph='teacher' glyphColor={location.pathname.includes('teachers') ? 'white' : 'grey'} />
              <p>Преподаватели</p>
            </Link>
            <Link to='/subjects' className={`${styles.links__link} ${location.pathname.includes('subjects') ? styles.links__link_active : ''}`}>
              <Icon glyph='subject' glyphColor={location.pathname.includes('subjects') ? 'white' : 'grey'} />
              <p>Предметы</p>
            </Link>
          </div>
        </div>
  )
}