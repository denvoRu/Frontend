import { Icon } from '../icon'
import styles from './table.module.scss'

type TableProps = {
  titles: string[]
  data: { name: string, raiting: number }[]
}


export default function Table({ titles, data }: TableProps) {
  return (
    <>
      <div className={styles.table}>
        <div className={`${styles.table__line} ${styles.table__line_title}`}>
          {titles.map((title) => (
            <p key={title} className={styles.table__title}>{title}</p>
          ))}
        </div>
        {data.map((el) => (
          <div className={`${styles.table__line} ${styles.table__line_content}`}>
            <p className={styles.table__content}>{el.name}</p>
            <p className={styles.table__content}>{el.raiting}</p>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <Icon glyph='arrow-left' glyphColor='grey' containerStyle={styles.pagination__control} />
        <Icon glyph='arrow-right' glyphColor='black' containerStyle={styles.pagination__control} />
      </div>
    </>
  )
}