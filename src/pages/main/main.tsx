import { Helmet } from 'react-helmet-async'
import styles from './main.module.scss'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useState } from 'react'
import { RAITING_LIST } from '../../consts/raitingList'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { updateRadioButtonList } from '../../utils/list'
import { INSTITUTES_LIST } from '../../mocks/institutes'
import { Link } from 'react-router-dom'

export default function Main() {

  const [sortList, setSortList] = useState(RAITING_LIST)
  const [isOpenList, setIsOpenList] = useState(false)

  const [statistics, _] = useState(INSTITUTES_LIST)

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
            <h1 className={styles.container__title}>Рейтинг Университета</h1>
          </div>
          <SortBlock 
            title='По рейтингу' icon='sort' list={sortList} type='radioButton' 
            onChange={onChangeSortList} 
            isOpenList={isOpenList} 
            changeIsOpenList={()=>setIsOpenList(!isOpenList)}
          />
        </div>
        <div className={styles.statisticsBlock}>
          <div className={styles.statistics}>
            {statistics.map((statistic) => (
              <Link to='/institutes/2' className={`${styles.statistics__point} ${styles.statistics__point_blue} ${isOpenList ? 'opacity' : ''}`} key={statistic.name} style={{ width: `${statistic.percent}%` }}>
                <p>{statistic.name}</p>
                <p>{statistic.percent}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}