import { Helmet } from 'react-helmet-async'
import styles from './statistics.module.scss'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { Icon } from '../../components/icon'
import GreyBlockContainer from '../../components/greyBlockContainer/greyBlockContainer'
import { SmilesList } from '../../consts/smilesList'
import { useState } from 'react'
import { GradesList } from '../../types/gradesList'
import { BadGradesList, GoodGradesList } from '../../consts/gradesList'

export default function StatisticsPage() {

  const [totalSmileList,] = useState(SmilesList.reduce((acc, item) => acc + item.count, 0))
  const [totalGoodGradesList,] = useState(GoodGradesList.reduce((acc, item) => acc + item.count, 0))
  const [totalBadGradesList,] = useState(BadGradesList.reduce((acc, item) => acc + item.count, 0))

  return (
    <>
      <Helmet>
        <title>Статистика</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks />
        <div className={styles.container__title}>
          <Icon glyph='review' />
          <h3>Статистика</h3>
        </div>
        <div className={styles.container__statistics}>
          <div className={styles.statistics__left}>
            <GradesBlock title='Рейтинг по предмету ' titleCount={99} subtitle='Количество оценок' subtitleCount={totalSmileList} list={SmilesList} />
            <GradesBlock title='Положительные аспекты' subtitle='Количество оценок' subtitleCount={totalGoodGradesList} list={GoodGradesList}/>
            <GradesBlock title='Негативные аспекты' subtitle='Количество оценок' subtitleCount={totalBadGradesList} list={BadGradesList}/>
          </div>
          <div className={styles.statistics__right}>
            <GreyBlockContainer>
              <div className={`${styles.feedback}`}>
                <div className={styles.feedback__block}>
                  <p className={styles.feedback__title}>Оценка:</p>
                  <img src={`/icons/grades/1.png`}/>
                </div>
                <div className={styles.feedback__list}>
                  {GoodGradesList.map((grade) => (
                    <p className={styles.statistics__pointValue}>{grade.value}</p>
                  ))}
                </div>
                <p className={styles.feedback__content}> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum auctor quis turpis non tempus. 
                  Fusce tincidunt rhoncus ante a consectetur. Ut bibendum erat justo, in gravida mauris dignissim at. 
                  Vestibulum a tempor ex. Proin in sapien id nisl bibendum molestie non non diam. 
                  Vestibulum sagittis urna lorem, a volutpat quam eleifend eu. Etiam aliquet justo a neque sagittis, quis faucibus erat interdum.
                </p>
              </div>
            </GreyBlockContainer>
          </div>
        </div>
      </div>
    </>
  )
}

type GradesBlockProps = {
  title: string
  titleCount?: number
  subtitle: string
  subtitleCount: number
  list: GradesList
}

function GradesBlock({ title, titleCount, subtitle, subtitleCount, list }: GradesBlockProps) {
  return (
    <GreyBlockContainer>
      <>
        <div className={`${styles.statistics__line} ${styles.statistics__line_mb4}`}>
          <p className={styles.statistics__subject}>{title}</p>
          {titleCount && <p className={styles.statistics__subject}>{titleCount}</p>}
        </div>
        <div className={`${styles.statistics__line} ${styles.statistics__line_mb16}`}>
          <p className={styles.statistics__grades}>{subtitle}</p>
          <p className={styles.statistics__grades}>{subtitleCount}</p>
        </div>
        {list.map((point, index) => (
          <div className={`${styles.statistics__line}`}>
            {!point.value ?
              <>
                <img src={`/icons/grades/${SmilesList.length - index}.png`} />
                <div className={styles.statistics__progress}>
                  <div style={{ width: `${point.count * 100 / subtitleCount}%` }} className={styles.statistics__value} />
                </div>
                <p className={styles.statistics__grades}>{point.count}</p>
              </> :
              <>
                <p className={styles.statistics__pointValue}>{point.value}</p>
                <div className={styles.statistics__progress}>
                  <div style={{ width: `${point.count * 100 / subtitleCount}%` }} className={styles.statistics__value} />
                </div>
                <p className={styles.statistics__grades}>{point.count}</p>
              </>
            }
          </div>
        ))}
      </>
    </GreyBlockContainer>
  )
}