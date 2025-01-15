import { Button } from '../../components/button/button'
import { Input } from '../../components/input/Input'
import { BadFeedBack, GoodFeedback } from '../../consts/feedback'
import { SmilesList } from '../../consts/smilesList'
import styles from './feedback.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useEffect, useState } from 'react'
import { getPrettyTime, getUTCCurrentDate } from '../../utils/date'
import { removeElementAtIndex } from '../../utils'
import axios, { PagesURl } from '../../services/api';
import { useParams } from 'react-router-dom'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'swiper/css'
import { FeedbackLesson } from '../../types/feedback'

type Feedback = {
  mark?: number
  student_name: string
  tags: string[]
  comment: string
  extra_fields?: {question: string, answer: string}[]
}

export default function FeedBack(){

  const {id} = useParams()

  const [lesson, setLesson] = useState<FeedbackLesson>()

  const [feedback, setFeedback] = useState<Feedback>({student_name: '', tags: [], comment: ''})

  const [error, setError] = useState<string>()

  const changeMark = (mark: number) => {
    if (feedback.mark && ((feedback.mark > 3 && mark < 4) || (mark > 3 && feedback.mark < 4))){
      setFeedback({...feedback, tags: [], mark: mark})
    } else {
      setFeedback({...feedback, mark: mark})
    }
  }

  const changeTagList = (value: string) => {
    const index = feedback.tags.findIndex((tag)=>tag===value)
    if (index !== -1){
      setFeedback({...feedback, tags: removeElementAtIndex(feedback.tags, index)})
    } else {
      setFeedback({...feedback, tags: [...feedback.tags, value]})
    }
  }

  const getLessonInfo = async () => {
    try {
      const data = await axios.get<FeedbackLesson>(PagesURl.LESSON + `/active/${id}`)
      setLesson(data.data)
    } catch (error) {
      console.log(error)
      setError('Ссылка неактивна или такая пара отсутствует')
    }
  }
  
  const sendFeedBack = async () => {
    if (!feedback.mark) {
      return
    }
    try {
      await axios.post(PagesURl.LESSON + `/${id}/feedback`,{
        ...feedback, 
        tags: feedback.tags.map((tag)=>tag.toLocaleLowerCase()),
        created_at: getUTCCurrentDate()
      })
      setError('Отзыв отправлен')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getLessonInfo()
  },[])

  if (!lesson || error) {
    return <>{error}</>
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.container__title}>Форма обратной связи</h3>
      <div>
        <p className={styles.container__subtitle}>{lesson.subject_name}</p>
        <p style={{marginTop: '12px'}} className={styles.container__text}>{lesson.lesson_name}</p>
        <p className={styles.container__text}>{`Время: ${getPrettyTime(lesson.start_time)}-${getPrettyTime(lesson.end_time)}`}</p>
      </div>
      <div>
        <p className={styles.container__subtitle}>Преподаватели</p>
        <p style={{marginTop: '12px'}} className={styles.container__text}>Преподаватель: <span>{lesson.speaker_name}</span></p>
      </div>
      <p className={styles.container__subtitle}>Введите свое ФИО&nbsp;<span className={styles.container__star}>*</span></p>
      <div className={styles.container__input}>
        <Input maxValues={300} placeholder='Фамилия Имя Отчество' value={feedback.student_name} onChange={(value)=>{setFeedback({...feedback, student_name: value})}}/>
      </div>
      <p className={styles.container__subtitle}>Выберите оценку&nbsp;<span className={styles.container__star}>*</span></p>
      <div className={styles.container__list}>
        {SmilesList.map((smile, index) => (
          <img 
            key={smile.name}
            className={styles.container__smile}
            onClick={()=>changeMark(SmilesList.length - index)} 
            style={(feedback.mark === SmilesList.length - index) ? {opacity: 1} : {}}
            width={60} height={60} alt={smile.name} 
            src={`/icons/grades/${SmilesList.length - index}.svg`} 
          />
        ))}
      </div>
      {feedback.mark && 
        <>
          <p className={styles.container__subtitle}>Выберите причины оценки</p>
          <div className={styles.container__swiperBlock}>
            <Swiper spaceBetween={16} slideClass={styles.container__slide} className={styles.container__slider} slidesPerView={2.7}>
              {feedback.mark > 3 ? 
              GoodFeedback.map((item) => (
                <SwiperSlide key={item.name} className={`${styles.container__slide} ${feedback.tags.includes(item.title) && styles.container__slide_active}`}>
                  <div onClick={()=>changeTagList(item.title)} className={styles.container__slideContent}>
                    <img className={styles.container__slideImg} src={`/icons/feedback/${item.name}.svg`} />
                    <p>{item.title}</p>
                  </div>
                </SwiperSlide>
              )) : 
              BadFeedBack.map((item) => (
                <SwiperSlide key={item.name} className={`${styles.container__slide} ${feedback.tags.includes(item.title) && styles.container__slide_active}`}>
                  <div onClick={()=>changeTagList(item.title)} className={`${styles.container__slideContent}`}>
                    <img className={styles.container__slideImg} src={`/icons/feedback/${item.name}.svg`} />
                    <p>{item.title}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      }
      <div>
        <p style={{marginBottom: '8px'}} className={styles.container__subtitle}>Впечатления, пожелания, комментарии</p>
        <div className={styles.container__input}>
          <Input maxValues={300} placeholder='Напишите о своих впечатлениях...' value={feedback.comment} onChange={(value)=>{setFeedback({...feedback, comment: value})}}/>
        </div>
      </div>
      <div className={styles.container__input}>
        <Button onClick={sendFeedBack} size={'max'}>Отправить форму</Button>
      </div>
    </div>
  )
}