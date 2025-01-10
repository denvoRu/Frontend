import { Helmet } from 'react-helmet-async'
import styles from './schedule.module.scss'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { useParams } from 'react-router-dom'
import axios, { PagesURl } from '../../services/api';
import { Teacher } from '../../types/teacher';
import { useEffect, useState } from 'react';
import { getNameByAllNames } from '../../utils/teacher';
import { Button } from '../../components/button/button';
import { Icon } from '../../components/icon';
import { CallSchedule, ScheduleDays } from '../../consts/schedule';
import { createDateArrayFromRange, formatDate, formatDateUTC, formatWeekAsString, getCurrentWeek, getWeekDayAndDate, getWeekNumber, shiftWeek } from '../../utils/date';
import { createNestedArray } from '../../utils';
import { Schedule } from '../../types/schedule';
import PopupContainer from '../../components/popupContainer/popupContainer';
import { AddInput, Input } from '../../components/input/Input';
import { LIST_LIMIT } from '../../consts/limit';
import { Subjects } from '../../types/subject';
import RightPopupContainer from '../../components/rightPopupContainer/rightPopupContainer';
import QrCode from '../../components/qrCode/qrCode';

type NewLesson = {
  subject?: {name: string, id: string}, time: string, teacher: string, name: string, dayNumber: number
}

export default function SchedulePage() {

  const { id } = useParams()
  const [teacher, setTeacher] = useState<Teacher>()

  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentWeek())
  const [weekNumber, setWeekNumber] = useState<number>()
  const [weekArray, setWeekArray] = useState<string[]>([])
  const [weekSchedule, setWeekSchedule] = useState<Schedule[][][]>()
  const [selectedLesson, setSelectedLesson] = useState<Schedule>()
  const [subjects, setSubjects] = useState<Subjects>()
  const [newLesson, setNewLesson] = useState<NewLesson>()

  const [qrCode, setQrCode] = useState<string>()

  const [closedLink, setClosedLink] = useState(true)

  const getPrettyTime = (time: string) => {
    return time.slice(0, time.length - 3)
  }

  const getScheduleArray = (schedule: Schedule[]) => {
    const week = createNestedArray<Schedule>(7)
    for (const lesson of schedule) {
      const start = lesson.start_time
      const end = lesson.end_time
      const lessonNumber = CallSchedule.findIndex((call)=>call === `${getPrettyTime(start)} - ${getPrettyTime(end)}`)
      const dayNumber = weekArray.findIndex((day)=>(day === getWeekDayAndDate(lesson.date)))
      if (lessonNumber !== -1 && dayNumber !== -1){
        week[lessonNumber][dayNumber].push(lesson)
      }
    }
    setWeekSchedule(week)
  }

  const displayNewLesson = (dayNumber: number, time: string) => {
    if (!teacher){
      return
    }
    setNewLesson({
      name: '',
      dayNumber: dayNumber,
      time: time,
      teacher: teacher.name
    })
  }

  const createLesson = async () => {
    if (!newLesson || !newLesson.subject || !weekNumber) {
      return
    }
    try {
      const times = newLesson.time.split(' - ')
      const {config} = await axios.post(PagesURl.SCHEDULE + `/${id}`, {
        subject_id: newLesson.subject.id,
        lesson_name: newLesson.name,
        speaker_name: newLesson.teacher,
        week: weekNumber - 2,
        day: newLesson.dayNumber,
        start_time: times[0],
        end_time: times[1]
      })
      console.log(config)
      setNewLesson(undefined)
      getWeekSchedule()
    } catch (error) {
      console.log(error)
    }
  }

  const getTeacherName = async () => {
    try {
      const { data } = await axios.get<Teacher>(PagesURl.TEACHER + `/${id}`)
      getNameByAllNames(data)
      setTeacher(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getWeekSchedule = async () => {
    try {
      const { data } = await axios.get<Schedule[]>(PagesURl.LESSON + `/${id}`, {
        params: {
          start_date: formatDateUTC(selectedPeriod[0]),
          end_date: formatDateUTC(selectedPeriod[1])
        }
      })
      getScheduleArray(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getSubjects = async (search?:string) => {
    try {
      const {data} = await axios.get<Subjects>(PagesURl.SUBJECT, {
        params: {
          teacher_ids: id,
          limit: LIST_LIMIT,
          search: search
        }
      })
      setSubjects(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getMembersExcel = async (id: string | undefined) => {
    try {
      const {data} = await axios.get(PagesURl.LESSON + `/${id}/members/xlsx`)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  const getFeedbackExcel = async (id: string | undefined) => {
    try {
      const {data} = await axios.get(PagesURl.LESSON + `/${id}/feddback/xlsx`)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  const generateQrCode = async (id: string | undefined, date: string) => {
    if (!teacher){
      return
    }
    try {
      const {data, config} = await axios.post<string>(PagesURl.SCHEDULE + `/${teacher.id}/${id}/lesson`, undefined, {
        params: {
          date: date
        }
      })
      console.log(data, config)
      setQrCode(data)
      setSelectedLesson(undefined)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteLessonFromSchedule = async (id: string | undefined) => {
    try {
      await axios.delete(PagesURl.SCHEDULE + `/${id}`)
      setSelectedLesson(undefined)
      getWeekSchedule()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTeacherName()
    getSubjects()
  }, [])

  useEffect(() => {
    if (selectedPeriod) {
      setWeekNumber(getWeekNumber(selectedPeriod[0]))
      setWeekArray(createDateArrayFromRange(selectedPeriod))
      if (weekArray) {
        getWeekSchedule()
      }
    }
  }, [selectedPeriod])

  useEffect(()=>{
    if (weekArray) {
      getWeekSchedule()
    }
  },[weekArray])

  if (!teacher || !weekSchedule || !subjects) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>Расписание</title>
      </Helmet>
      <div>
        <LocationLinks paramNames={[{ name: teacher.name, id: teacher.id }]} />
        <div className={styles.controls}>
          <div className={styles.controls__week}>
            <Button onClick={() => setSelectedPeriod(shiftWeek(selectedPeriod.slice(), -1))} variant='whiteMain' className={styles.controls__button}>
              <Icon glyph='arrow-left' glyphColor='grey' />
            </Button>
            <Button variant='whiteMain'>
              <Icon glyph='schedule' />
              <p>{formatWeekAsString(selectedPeriod)}</p>
            </Button>
            <Button onClick={() => setSelectedPeriod(shiftWeek(selectedPeriod, 1))} variant='whiteMain' className={styles.controls__button}>
              <Icon glyph='arrow-right' glyphColor='black' />
            </Button>
          </div>
          {/* <QrCode/> */}
          {/* <Button variant='whiteMain'>
            <Icon glyph='export' glyphColor='grey'/>
            <p className={styles.controls__text}>Экспортировать отзывы в exel</p>
          </Button> */}
        </div>
        <div className={styles.table}>
          <table className={styles.table__content}>
            <tbody>
              <tr className={styles.table__tr}>
                <td className={`${styles.table__td} ${styles.table__text_active} ${styles.table__td_bt}`}>
                  <div className={`${styles.table__textBlock} `}>
                    <p className={`${styles.table__text}`}>{weekNumber}&nbsp;неделя</p>
                  </div>
                </td>
                {weekArray.map((day, index) => (
                  <td key={day} 
                    className={`${styles.table__td} ${styles.table__textBlock_title} 
                    ${formatDate(new Date) === day ? styles.table__text_active : ''} 
                    ${styles.table__td_bt}`}
                  >
                    <div className={`${styles.table__textBlock}`}>
                      <p>{`${ScheduleDays[index]} ${day}`}</p>
                    </div>
                  </td>
                ))}
              </tr>
              {weekSchedule.map((row, index) => (
                <tr key={index} className={styles.table__tr}>
                  <td className={`${styles.table__td} ${styles.table__textBlock_title} `}>
                    <div className={`${styles.table__textBlock}`}>
                      <div>
                        <p>{`${index + 1} пара`}</p>
                        <p className={styles.table__call}>{CallSchedule[index]}</p>
                      </div>
                    </div>
                  </td>
                  {row.map((day, dayNumber) => (
                    <td key={dayNumber} onClick={day.length === 0 ? ()=>displayNewLesson(dayNumber, CallSchedule[index]) : undefined}
                     style={{cursor: 'pointer'}}  className={`${styles.table__td} `}>
                      <div style={{cursor: 'pointer'}} className={`${styles.table__textBlock} ${styles.table__lessons}`}>
                        {day.map((lesson, index)=>(
                          <div onClick={()=>setSelectedLesson(lesson)} key={`${lesson.lesson_name}--${index}`}>
                            <p>{lesson.lesson_name}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {newLesson && 
      <PopupContainer>
        <div className={styles.popup}>
          <h2 className={styles.popup__title}>Добавить пару</h2>
          <AddInput
            singleMode 
            totalParts={subjects.total_pages}
            currentPart={subjects.page_number}
            selectedList={newLesson.subject ? [newLesson.subject] : []} 
            placeholder='Введите название предмета' 
            allList={subjects.content} 
            onSearch={getSubjects} title='Предмет'
            changeInputList={(list)=>setNewLesson({...newLesson, subject: list[0]})}
          />
          <p className={styles.popup__subject}>Название предмета</p>
          <div>
            <p className={styles.popup__text}>{`Дата: ${weekArray[newLesson.dayNumber]}`}</p>
            <p className={styles.popup__text}>{`Время: ${newLesson.time}`}</p>
            <p className={styles.popup__text}>{`Преподаватель: ${newLesson.teacher}`}</p>
          </div>
          <Input placeholder='Название пары' value={newLesson.name} onChange={(value)=>setNewLesson({...newLesson, name: value})}/>
          <div className={styles.popup__buttons}>
            <Button onClick={()=>setNewLesson(undefined)} size={'max'} variant={'whiteMain'}>Отмена</Button>
            <Button onClick={createLesson} size={'max'} variant={'primary'}>Добавить</Button>
          </div>
        </div>
      </PopupContainer>}
      {selectedLesson && selectedLesson.schedule_lesson_id && 
      <RightPopupContainer>
        <div className={styles.lesson}>
          <div className={styles.lesson__titleLine}>
            <div className={styles.lesson__title}>
              <Icon glyph='subject'/>
              <h3>{selectedLesson.lesson_name}</h3>
            </div>
            <img onClick={()=>setSelectedLesson(undefined)} style={{cursor: 'pointer'}} src='/icons/close.svg'/>
          </div>
          <p className={styles.lesson__titleValue}>{selectedLesson.subject_name}</p>
          <div className={styles.lesson__info}>
            <p className={styles.info__title}>Информация о паре:</p>
            <p className={styles.info__text}>{`Дата: ${getWeekDayAndDate(selectedLesson.date)}`}</p>
            <p className={styles.info__text}>{`Время: ${getPrettyTime(selectedLesson.start_time)}-${getPrettyTime(selectedLesson.end_time)}`}</p>
          </div>
          <div className={styles.lesson__info}>
            <p className={styles.info__title}>Преподаватель:</p>
            <p className={styles.info__text}>{selectedLesson.speaker_name}</p>
          </div>
          <div className={styles.lesson__info}>
            <Button onClick={()=>{generateQrCode(selectedLesson.schedule_lesson_id, selectedLesson.date)}} variant={'whiteMain'}>
              <Icon glyph='edit'/>
              <p>Сгенерировать qr-код</p>
            </Button>
            <Button onClick={()=>deleteLessonFromSchedule(selectedLesson.schedule_lesson_id)} variant={'secondary'}>
              <Icon glyph='trash' glyphColor='white'/>
              <p>Удалить пару</p>
            </Button>
          </div>
        </div>
      </RightPopupContainer>}
      {selectedLesson && selectedLesson.id && 
      <RightPopupContainer>
        <div className={styles.lesson}>
          <div className={styles.lesson__titleLine}>
            <div className={styles.lesson__title}>
              <Icon glyph='subject'/>
              <h3>{selectedLesson.lesson_name}</h3>
            </div>
            <img onClick={()=>setSelectedLesson(undefined)} style={{cursor: 'pointer'}} src='/icons/close.svg'/>
          </div>
          <p className={styles.lesson__titleValue}>{selectedLesson.subject_name}</p>
          <div className={styles.lesson__info}>
            <p className={styles.info__title}>Информация о паре:</p>
            <p className={styles.info__text}>{`Дата: ${getWeekDayAndDate(selectedLesson.date)}`}</p>
            <p className={styles.info__text}>{`Время: ${getPrettyTime(selectedLesson.start_time)}-${getPrettyTime(selectedLesson.end_time)}`}</p>
          </div>
          <div className={styles.lesson__info}>
            <p className={styles.info__title}>Преподаватель:</p>
            <p className={styles.info__text}>{selectedLesson.speaker_name}</p>
          </div>
          <div className={`${styles.lesson__info} ${styles.lesson__info_line}`}>
            <p className={styles.info__title}>Рейтинг пары:</p>
            <p className={styles.info__title}>0</p>
          </div>
          <div className={styles.lesson__info}>
            <p className={styles.info__title}>Тэги:</p>
            {/* <p className={styles.info__tag}>Причина</p> */}
          </div>
          <div className={styles.lesson__info}>
          <Button onClick={()=>{setClosedLink(false)}} variant={'whiteMain'}>
              <Icon glyph='download'/>
              <p>Скачать qr-код</p>
            </Button>
            <Button variant={'primary'}>
              <p>Посмотреть статистику</p>
            </Button>
            <Button onClick={()=>{getMembersExcel(selectedLesson.id)}} variant={'primary'}>
              <p>Посмотреть посещаемость</p>
            </Button>
            <Button onClick={()=>{getFeedbackExcel(selectedLesson.id)}} variant='whiteMain'>
              <Icon glyph='export'/>
              <p>Экспортировать отзывы в exel</p>
            </Button>
            {!closedLink && <QrCode onClose={()=>setClosedLink(true)} isDisplay={false} id={selectedLesson.id}/>}
          </div>
        </div>
      </RightPopupContainer>}
      {qrCode && 
      <PopupContainer>
        <div style={{alignItems:'center'}} className={styles.popup}>
          <h2 className={styles.popup__title}>Ваш код</h2>
          <QrCode isDisplay id={qrCode}/>
          <Button onClick={()=>setQrCode(undefined)} size={'max'} variant={'whiteMain'}>Закрыть</Button>
        </div>
      </PopupContainer>}
    </>
  )
}