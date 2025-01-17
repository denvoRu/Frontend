import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../icon'
import styles from './bottomLinks.module.scss'
import { useEffect, useRef } from 'react'

export default function BottomLinks() {

  const location = useLocation()

  const blockRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const hasScroll = window.innerHeight < document.documentElement.scrollHeight - 1;
    if (blockRef.current && hasScroll){
      blockRef.current.style.position = 'absolute'
    }
  },[blockRef])

  return (
    <div ref={blockRef} className={styles.links}>
      <Link to='/teachers' className={`${styles.links__link} ${location.pathname.includes('teachers') ? styles.links__link_active : ''}`}>
        <Icon glyph='teacher' glyphColor={location.pathname.includes('teachers') ? 'white' : 'grey'} />
        <p>Преподаватели</p>
      </Link>
      <Link to='/modules' className={`${styles.links__link} ${location.pathname.includes('modules') ? styles.links__link_active : ''}`}>
        <Icon glyph='subject' glyphColor={location.pathname.includes('modules') ? 'white' : 'grey'} />
        <p>Предметы</p>
      </Link>
    </div>
  )
}