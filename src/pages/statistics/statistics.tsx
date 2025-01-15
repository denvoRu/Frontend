import { Helmet } from 'react-helmet-async'
import styles from './statistics.module.scss'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { Icon } from '../../components/icon'
import GreyBlockContainer from '../../components/greyBlockContainer/greyBlockContainer'
import { SmilesList } from '../../consts/smilesList'
import { useEffect, useState } from 'react'
import { GradesList } from '../../types/gradesList'
import { BadGradesList, GoodGradesList } from '../../consts/gradesList'
import { useParams } from 'react-router-dom'
import axios, { PagesURl } from '../../services/api';
import { Teacher } from '../../types/teacher'
import { getNameByAllNames } from '../../utils/teacher'
import { FeedbackList, Statistics } from '../../types/feedback'
import { getRole } from '../../services/role'

export default function StatisticsPage() {

  const {id, lessonId} = useParams()

  const [gradesList, setGradesList] = useState(SmilesList)

  const role = getRole()

  const [error, setError] = useState<string>()

  const [teacher, setTeacher] = useState<Teacher>()
  const [statistics, setStatistics] = useState<Statistics>()
  const [feedback, setFeedback] = useState<FeedbackList>()

  const getStatistics = async () => {
    try {
      const {data} = await axios.get<Statistics>(PagesURl.LESSON + `/${lessonId}/statistics`)
      setStatistics(data)
      console.log(data)
      setGradesList(getSmilesList(data))
    } catch (error) {
      setError('Доступ запрещен, обратитесь к администратору')
      console.log(error)
    }
  }
  const getFeedback = async () => {
    try {
      const {data} = await axios.get<FeedbackList>(PagesURl.LESSON + `/${lessonId}/feedback`)
      setFeedback(data)
    } catch (error) {
      console.log(error)
      setError('Доступ запрещен, обратитесь к администратору')
    }
  }
  const getTeacher = async () => {
    try {
      const {data} = await axios.get<Teacher>(PagesURl.TEACHER + `/${id}`)
      getNameByAllNames(data)
      setTeacher(data)
    } catch (error) {
      console.log(error)
    }
  }
  const getSmilesList = (statistics: Statistics) => {
    const smilesList = SmilesList.slice()
    for (const key in statistics.marks) {
      const numericKey = Number(key)
      smilesList[smilesList.length - numericKey].count = statistics.marks[key]
    }
    return smilesList
  }

  const getTags = (statistics: Statistics, isBad: boolean) => {
    const list = isBad ? BadGradesList : GoodGradesList;
    const tags = isBad ? statistics.bad_tags : statistics.good_tags;
    
    return list.map(tag => ({
      ...tag,
      count: tags.find(item => item.name === tag.value?.toLocaleLowerCase())?.count ?? 0
    }));
  };

  useEffect(()=>{
    getStatistics()
    getFeedback()
    if (role === 'admin') {
      getTeacher()
    }
  },[])

  if (!lessonId || !statistics || !feedback || error) {
    return <>{error}</>
  }

  return (
    <>
      <Helmet>
        <title>Статистика</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramNames={
          teacher ? [{id: teacher.id, name: teacher.name}, {id: lessonId, name: statistics.subject_name}] :
          [{id: lessonId, name: statistics.subject_name}]
          }/>
        <div className={styles.container__title}>
          <Icon glyph='review' />
          <h3>Статистика</h3>
        </div>
        <div className={styles.container__statistics}>
          <div className={styles.statistics__left}>
            <GradesBlock 
              title='Рейтинг по предмету ' 
              titleCount={statistics.subject_rating} 
              subtitle='Количество оценок' 
              subtitleCount={feedback.content.length} list={gradesList} 
            />
            <GradesBlock 
              title='Положительные аспекты' 
              subtitle='Количество оценок' 
              subtitleCount={statistics.good_tags.reduce((acc, item) => acc + item.count, 0)} 
              list={getTags(statistics, false)}
            />
            <GradesBlock 
              title='Негативные аспекты' 
              subtitle='Количество оценок' 
              subtitleCount={statistics.bad_tags.reduce((acc, item) => acc + item.count, 0)} 
              list={getTags(statistics, true)}
            />
          </div>
          <div className={styles.statistics__right}>
            {feedback.content.map((item) => (
              <GreyBlockContainer key={item.id}>
                <div className={`${styles.feedback}`}>
                  <div className={styles.feedback__block}>
                    <p className={styles.feedback__title}>Оценка:</p>
                    <img src={`/icons/grades/${item.mark}.png`} />
                  </div>
                  <div className={styles.feedback__list}>
                    {item.tags.map((grade) => (
                      <p key={grade} className={styles.statistics__pointValue}>{grade}</p>
                    ))}
                  </div>
                  <p className={styles.feedback__content}>{item.comment}</p>
                </div>
              </GreyBlockContainer>
            ))}
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
          <div key={`${point.name}--${index}`} className={`${styles.statistics__line}`}>
            {!point.value ?
              <>
                <img src={`/icons/grades/${SmilesList.length - index}.png`} />
                <div className={styles.statistics__progress}>
                  <div style={{ width: `${subtitleCount ? point.count * 100 / subtitleCount : 0}%` }} className={styles.statistics__value} />
                </div>
                <p className={styles.statistics__grades}>{point.count}</p>
              </> :
              <>
                <p className={styles.statistics__pointValue}>{point.value}</p>
                <div className={styles.statistics__progress}>
                  <div style={{ width: `${subtitleCount ? point.count * 100 / subtitleCount : 0}%` }} className={styles.statistics__value} />
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