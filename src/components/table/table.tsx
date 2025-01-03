import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../icon'
import styles from './table.module.scss'
import { TableEntity } from '../../types/tableEntity'
import { useState } from 'react'

type TableProps = {
  titles: string[]
  data: (TableEntity | { name: string, rating: number, subjects: TableEntity[] })[]
  isOpacity?: boolean
  changePage: (toNext: boolean) => void
  currentPage: number
  totalPages: number
}


export default function Table({ titles, data, isOpacity, changePage, totalPages, currentPage }: TableProps) {

  const navigate = useNavigate()

  const onChangePage = (isNext: boolean) => {
    if (!isNext && currentPage !== 1){
      changePage(false)
    } else if (isNext && totalPages !== currentPage){
      changePage(true)
    }
  }

  return (
    data.length !== 0 && 
    <>
      <div className={`${styles.table} ${isOpacity ? styles.table_opacity : ''}`}>
        <div className={`${styles.table__line} ${styles.table__line_title}`}>
          {titles.map((title) => (
            <p key={title} className={styles.table__title}>{title}</p>
          ))}
        </div>
        {data.map((el) => (
          'subjects' in el ?
            <ModuleBlock key={el.name} module={el}/> :
            <div key={el.name} onClick={() => { navigate(`/teachers/${el.id}`) }} className={`${styles.table__line} ${styles.table__line_content}`}>
              <p className={`${styles.table__content} ${styles.table__content_name}`}>{el.name}</p>
              <p className={`${styles.table__content} ${styles.table__content_raiting}`}>{el.rating}</p>
            </div>
        ))}
      </div>
      
      {totalPages > 1 &&
       <div className={styles.pagination}>
        <Icon onClick={()=>{onChangePage(false)}} glyph='arrow-left' glyphColor={currentPage === 1 ? 'grey' : 'black'}containerStyle={`${styles.pagination__control} ${currentPage !== 1 ? styles.pagination__control_active : ''}`} />
        <Icon onClick={()=>{onChangePage(true)}} glyph='arrow-right' glyphColor={totalPages === currentPage ? 'grey' : 'black'} containerStyle={`${styles.pagination__control} ${totalPages !== currentPage ? styles.pagination__control_active : ''}`} />
      </div>}
    </>
  )
}

type ModuleProps = {
  module: { name: string, rating: number, subjects: TableEntity[] }
}

function ModuleBlock({ module }: ModuleProps) {

  const [isDisplayList, setIsDisplayList] = useState(false)

  return (
    <div className={styles.table__block}>
      <div onClick={()=>{setIsDisplayList(!isDisplayList)}} className={`${styles.table__line} ${styles.table__line_content}`}>
      <p className={`${styles.table__content} ${styles.table__content_name}`}>{module.name}</p>
      <p className={`${styles.table__content} ${styles.table__content_raiting}`}>{module.rating}</p>
        <Icon className={`${styles.table__icon} ${isDisplayList ? styles.table__icon_open : ''}`} glyph={`arrow-up`} glyphColor='grey'/>
      </div>
      {isDisplayList && module.subjects.map((subject) => (
        <Link key={subject.id} to={`/modules/${subject.id}`} className={`${styles.table__line} ${styles.table__line_content}`}>
          <p className={`${styles.table__content} ${styles.table__line_margin}  ${styles.table__content_name}`}>{subject.name}</p>
          <p className={`${styles.table__content} ${styles.table__content_raiting}`}>{subject.rating}</p>
        </Link>
      ))}
    </div>
  )
}