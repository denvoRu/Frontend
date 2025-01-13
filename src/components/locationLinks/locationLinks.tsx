import { Link, useLocation} from 'react-router-dom';
import styles from './locationLinks.module.scss';
import { Icon } from '../icon';

type LocationLinksProps = {
  paramNames?: {name: string, id: string}[];
};

const translations: Record<string, string> = {
  modules: 'Предметы',
  teachers: 'Преподаватели',
  institutes: 'Институты',
  schedule: 'Расписание',
  statistics: 'Статистика'
};

export default function LocationLinks({ paramNames }: LocationLinksProps) {

  const location = useLocation()

  const createBreadcrumbTrail = () => {
    const parts = location.pathname.replace(/^\/|\/$/g, '').split('/');

    const result = parts.map((part, index) => {
      let title = ''
      if (translations[part]){
        title = translations[part]
      } else {
        if (!paramNames){
          title = part
        } else {
          const index = paramNames.findIndex((param)=>(param.id === part))
          if (index !== -1){
            title = paramNames[index].name
          } else {
            title = part
          }
        }
      }
      if (index === parts.length - 1) {
        return {title, link: undefined}
      }
      const link = '/' + parts.slice(0, index + 1).join('/')
      return { title, link };
    });
    return result
  };

  return (
    <div className={styles.container}>
      {createBreadcrumbTrail().map(({ title, link }) => (
        <div key={`${title}`} className={styles.container__block}>
          {link ? (
            <Link className={styles.container__link} to={link}>
              {title}
            </Link>
          ) : (
            <p className={styles.container__link}>{title}</p>
          )}
          {link && <Icon size={16} glyph="arrow-right" glyphColor="ultra-light-grey" />}
        </div>
      ))}
    </div>
  );
}