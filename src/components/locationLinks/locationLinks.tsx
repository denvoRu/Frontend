import { Link, useLocation } from 'react-router-dom';
import styles from './locationLinks.module.scss';
import { Icon } from '../icon';

type LocationLinksProps = {
  paramNames?: string[]; // Теперь это массив строк
};

const translations: Record<string, string> = {
  modules: 'Предметы',
  teachers: 'Преподаватели',
  institutes: 'Институты',
};

export default function LocationLinks({ paramNames }: LocationLinksProps) {
  const location = useLocation();

  const createBreadcrumbTrail = () => {
    const parts = location.pathname.replace(/^\/|\/$/g, '').split('/');
    
    if (paramNames?.length) {
      for (let i = Math.max(parts.length - paramNames.length, 0); i < parts.length; i++) {
        parts[i] = paramNames[paramNames.length - (parts.length - i)];
      }
    }

    return parts.map((part, index) => {
      const title = translations[part] ?? part;
      const link = index < parts.length - 1 ? `/${parts.slice(0, index + 1).join('/')}` : undefined;

      return { title, link };
    });
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