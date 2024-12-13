import { Link, useLocation } from 'react-router-dom'
import styles from './locationLinks.module.scss'
import { Icon } from '../icon'

type LocationLinksProps = {
  paramName?: string
}

const translations:Record<string, string> = {
  subjects: 'Предметы',
  teachers: 'Преподаватели'
};


export default function LocationLinks ({paramName}:LocationLinksProps) {

  const location = useLocation()

  const createBreadcrumbTrail = () => {
    const parts = location.pathname.replace(/^\/|\/$/g, '').split('/');

    if (paramName && parts.length > 0) {
      parts[parts.length - 1] = paramName;
    }

    return parts.map((part, index) => {
      const title = translations[part] ?? part;
      const link = index < parts.length - 1 ? `/${parts.slice(0, index + 1).join('/')}` : undefined;

      return { title, link };
    });
  }

  return (
    <div className={styles.container}>
      {createBreadcrumbTrail().map(({title, link})=>(
        <>
          {link ? <Link className={styles.container__link} to={link}>{title}</Link> : <p className={styles.container__link}>{title}</p>}
          {link && <Icon size={16} glyph='arrow-right' glyphColor='ultra-light-grey'/>}
        </>
      ))}
    </div>
  )
}