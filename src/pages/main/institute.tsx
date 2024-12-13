import { Helmet } from 'react-helmet-async'
import styles from './main.module.scss'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useState } from 'react'
import { RAITING_LIST } from '../../consts/raitingList'
import { SUBJECT_STATISTICS } from '../../mocks/subjectsStatistics'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { updateRadioButtonList } from '../../utils/list'
import LocationLinks from '../../components/locationLinks/locationLinks'
import GreyBlockContainer from '../../components/greyBlockContainer/greyBlockContainer'

export default function Institute() {

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
        <title>ИРИТ-РТФ</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramName='ИРИТ-РТФ'/>
        <div className={styles.container__sort}>
          <SortBlock
            title='По рейтингу' icon='sort' list={sortList} type='radioButton'
            onChange={onChangeSortList}
            isOpenList={isOpenList}
            changeIsOpenList={() => setIsOpenList(!isOpenList)}
          />
        </div>
        <GreyBlockContainer>
          <div className={styles.info}>
            <div className={styles.info__content}>
              <div className={styles.info__titleBlock}>
                <Icon glyph='institute'/>
                <h1 className={styles.info__title}>Институт радиоэлектроники и информационных технологий-РТФ</h1>
              </div>
              <p className={styles.info__text}>ИРИТ-РТФ Россия, г. Екатеринбург, ул. Мира 32</p>
            </div>
            <p className={styles.info__raiting}>Рейтинг: 99</p>
          </div>
        </GreyBlockContainer>
        <div style={{marginTop: '24px'}} className={styles.statisticsBlock}>
          <div className={styles.statistics}>
            {statistics.map((statistic) => (
              <div className={`${styles.statistics__point} ${styles.statistics__point_blue} ${isOpenList ? 'opacity' : ''}`} key={statistic.name} style={{ width: `${statistic.percent}%` }}>
                <p>{statistic.name}</p>
                <p>{statistic.percent}</p>
              </div>
            ))}
          </div>
        </div>
        <BottomLinks/>
      </div>
    </>
  )
}