import { Helmet } from 'react-helmet-async'
import styles from './main.module.scss'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useState } from 'react'
import { RAITING_LIST } from '../../consts/raitingList'
import { SUBJECT_STATISTICS } from '../../mocks/subjectsStatistics'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { updateRadioButtonList } from '../../utils/list'

export default function Main() {

  const [sortList, setSortList] = useState(RAITING_LIST)
  const [isOpenList, setIsOpenList] = useState(false)

  const [statistics, _] = useState(SUBJECT_STATISTICS)

  const onChangeSortList = (value: string) => {
    setSortList(updateRadioButtonList(value, sortList))
    setIsOpenList(false)
  }

  return (
    <>
      <Helmet>
        <title>Главная</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.container__firstLine}>
          <div className={styles.container__titleBlock}>
            <Icon glyph='rating' size={42} />
            <h1 className={styles.container__title}>Рейтинг института</h1>
          </div>
          <SortBlock 
            title='По рейтингу' icon='sort' list={sortList} type='radioButton' 
            onChange={onChangeSortList} 
            isOpenList={isOpenList} 
            changeIsOpenList={()=>setIsOpenList(!isOpenList)}
          />
        </div>
        <div className={styles.statistics}>
          {statistics.map((statistic)=>(
            <div className={styles.statistics__point} key={statistic.name} style={{width: `${statistic.percent}%`}}>
              <p>{statistic.name}</p>
              <p>{statistic.percent}</p>
            </div>
          ))}
        </div>
        <BottomLinks/>
      </div>
    </>
  )
}