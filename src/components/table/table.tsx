import { useNavigate } from 'react-router-dom'
import { Icon } from '../icon'
import styles from './table.module.scss'

type TableProps = {
  tableFrom: 'teachers' | 'subjects'
  titles: string[]
  data: { name: string, raiting: number, id: string }[]
  isOpacity?: boolean
}


export default function Table({ titles, data, tableFrom, isOpacity }: TableProps) {

  const navigate = useNavigate()

  return (
    <>
      <div className={`${styles.table} ${isOpacity ? styles.table_opacity : ''}`}>
        <div className={`${styles.table__line} ${styles.table__line_title}`}>
          {titles.map((title) => (
            <p key={title} className={styles.table__title}>{title}</p>
          ))}
        </div>
        {data.map((el) => (
          <div onClick={()=>{navigate(`/${tableFrom}/${el.id}`)}} className={`${styles.table__line} ${styles.table__line_content}`}>
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