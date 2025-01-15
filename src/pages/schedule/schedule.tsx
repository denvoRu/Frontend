import { Helmet } from 'react-helmet-async'
import styles from './schedule.module.scss'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { PagesURl } from '../../services/api';
import { Teacher } from '../../types/teacher';
import { useEffect, useState } from 'react';
import { getNameByAllNames } from '../../utils/teacher';
import { Button } from '../../components/button/button';
import { Icon } from '../../components/icon';
import { CallSchedule, ScheduleDays } from '../../consts/schedule';
import { convertTime, createDateArrayFromRange, formatDate, formatDateUTC, formatWeekAsString, generateDateStrings, getCurrentWeek, getDayAndWeekday, getDayOfWeek, getPrettyTime, getWeekDayAndDate, getWeekNumber, shiftWeek } from '../../utils/date';
import { createNestedArray } from '../../utils';
import { Schedule } from '../../types/schedule';
import PopupContainer from '../../components/popupContainer/popupContainer';
import { AddInput, Input } from '../../components/input/Input';
import { LIST_LIMIT } from '../../consts/limit';
import { Subject, Subjects } from '../../types/subject';
import RightPopupContainer from '../../components/rightPopupContainer/rightPopupContainer';
import QrCode from '../../components/qrCode/qrCode';
import { getRole } from '../../services/role';

type NewLesson = {
  subject?: {name: string, id: string}, time: string, teacher: string, name: string, date: string
}
type NewMobileLesson = {
  subject?: {name: string, id: string}, time?: {name: string, id: string}, teacher: string, name: string, date: string
}

export default function SchedulePage() {

  const navigate = useNavigate()

  const { subjectId, id } = useParams()
  const [teacher, setTeacher] = useState<Teacher>()

  const role = getRole()

  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentWeek())
  const [weekNumber, setWeekNumber] = useState<number>()
  const [weekArray, setWeekArray] = useState<string[]>([])
  const [weekSchedule, setWeekSchedule] = useState<Schedule[]>()
  const [selectedLesson, setSelectedLesson] = useState<Schedule>()
  const [subjects, setSubjects] = useState<Subjects>()

  const [selectedSubject, setSelectedSubject] = useState<Subject>()

  const [selectedMembers, setSelectedMembers] = useState<{name: string, created_at: string}[]>()

  const [newLesson, setNewLesson] = useState<NewLesson>()
  const [mobileNewLesson, setMobileNewLesson] = useState<NewMobileLesson>()

  const [qrCode, setQrCode] = useState<string>()

  const [closedLink, setClosedLink] = useState(true)

  const getCallScheduleIndexFromTime = ([start, end]:string[]) => {
    return CallSchedule.findIndex((call)=>call === `${getPrettyTime(start)} - ${getPrettyTime(end)}`)
  }

  const getScheduleArray = (schedule: Schedule[]) => {
    const week = createNestedArray<Schedule>(7)
    for (const lesson of schedule) {
      const start = lesson.start_time
      const end = lesson.end_time
      const lessonNumber = getCallScheduleIndexFromTime([start, end])
      const dayNumber = weekArray.findIndex((day)=>(day === getWeekDayAndDate(lesson.date)))
      if (lessonNumber !== -1 && dayNumber !== -1){
        week[lessonNumber][dayNumber].push(lesson)
      }
    }
    return week
  }

  const displayNewLesson = (date:string, time: string) => {
    if (!teacher){
      return
    }
    setNewLesson({
      name: '',
      date: date,
      time: time,
      teacher: teacher.name
    })
  }

  const createLesson = async (lesson:NewLesson) => {
    if (!lesson.subject) {
      return
    }
    try {
      const times = lesson.time.split(' - ')
      console.log({
        subject_id: lesson.subject.id,
        lesson_name: lesson.name,
        speaker_name: lesson.teacher,
        date: lesson.date,
        start_time: times[0],
        end_time: times[1]
      })
      await axios.post(PagesURl.LESSON + `/${role === 'admin' ? id : ''}`, {
        subject_id: lesson.subject.id,
        lesson_name: lesson.name,
        speaker_name: lesson.teacher,
        date: lesson.date,
        start_time: times[0],
        end_time: times[1]
      })
      setNewLesson(undefined)
      getWeekSchedule()
    } catch (error) {
      console.log(error)
    }
  }

  const onCreateLesson = async () => {
    if (!newLesson) {
      return
    }
    const selectedListDates = generateDateStrings(selectedPeriod)
    const date = selectedListDates.filter((date)=>(getWeekDayAndDate(date)===newLesson.date))
    createLesson({...newLesson, date: date[0]})
    setNewLesson(undefined)
  }
  const createMobileLesson = async () => {
    if (!mobileNewLesson || !mobileNewLesson.time) {
      return
    }
    createLesson({...mobileNewLesson, date: getDayOfWeek(mobileNewLesson.date), time: mobileNewLesson.time.id})
    setMobileNewLesson(undefined)
  }

  const getTeacherName = async () => {
    try {
      const { data } = await axios.get<Teacher>(PagesURl.TEACHER + `/${role === 'admin' ? id : 'me'}`)
      getNameByAllNames(data)
      setTeacher(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getWeekSchedule = async () => {
    try {
      const { data } = await axios.get<Schedule[]>(PagesURl.LESSON + `/${role === 'admin' ? id : ''}`, {
        params: {
          subject_ids: subjectId,
          start_date: formatDateUTC(selectedPeriod[0]),
          end_date: formatDateUTC(selectedPeriod[1])
        }
      })
      setWeekSchedule(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    } catch (error) {
      console.log(error)
    }
  }

  const getMobileWeekSchedule = (schedule: Schedule[]) => {
    const result:{day: string, weekDay: string, list:Schedule[]}[] = []
    for (const lesson of schedule) {
      const dayWithWeekDay = getDayAndWeekday(lesson.date)
      const resultIndex = result.findIndex((item)=>item.day === dayWithWeekDay[0])
      if (resultIndex !== -1){
        result[resultIndex].list.push(lesson)
      } else {
        result.push({day: dayWithWeekDay[0], weekDay: dayWithWeekDay[1], list: [lesson]})
      }
    }
    return result
  }

  const getSubjects = async (search?:string) => {
    try {
      const {data} = await axios.get<Subjects>(role!=='teacher' ? PagesURl.SUBJECT : PagesURl.TEACHER + '/me/subject', {
        params: {
          teacher_ids: id,
          limit: LIST_LIMIT,
          search: search
        }
      })
      if (subjectId) {
        setSelectedSubject(data.content.filter((subject)=>subject.id === subjectId)[0])
      }
      setSubjects(data)
    } catch (error) {
      console.log(error)
    }
  }
  const getFeedbackExcel = async (id: string | undefined) => {
    try {
      const {data} = await axios.get(PagesURl.LESSON + `/${id}/feedback/xlsx`,{
        responseType: 'blob',
      })
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'feedback.xlsx';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.log(error)
    }
  }
  const getMembersExcel = async () => {
    if (!selectedLesson) {
      return
    }
    try {
      const {data} = await axios.get(PagesURl.LESSON + `/${selectedLesson.id}/members/xlsx`,{
        responseType: 'blob',
      })
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'members.xlsx';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.log(error)
    }
  }

  const generateQrCode = async (id: string | undefined, date: string) => {
    if (!teacher){
      return
    }
    try {
      const {data} = await axios.post<string>(PagesURl.SCHEDULE + `/${teacher.id}/${id}/lesson`, undefined, {
        params: {
          date: date
        }
      })
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
  const getMembersLesson = async (id: string | undefined) => {
    try {
      const {data} = await axios.get<{name: string, created_at: string}[]>(PagesURl.LESSON + `/${id}/members`)
      setSelectedMembers(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSubjects()
    getTeacherName()
  }, [navigate])

  useEffect(() => {
    if (selectedPeriod) {
      setWeekNumber(getWeekNumber(selectedPeriod[0]))
      setWeekArray(createDateArrayFromRange(selectedPeriod))
      if (weekArray) {
        getWeekSchedule()
      }
    }
  }, [selectedPeriod, navigate])

  useEffect(()=>{
    if (weekArray) {
      getWeekSchedule()
    }
  },[weekArray, navigate])

  if (!weekSchedule) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>Расписание</title>
      </Helmet>
      <div>
        {teacher &&<LocationLinks paramNames={!selectedSubject ? [{ name: teacher.name, id: teacher.id }] : [{ name: teacher.name, id: teacher.id }, {name: selectedSubject.name, id: selectedSubject.id}]} />}
        {teacher &&<Button onClick={()=>setMobileNewLesson({name: '', date: '', teacher: teacher.name})} size={'max'} className={styles.add} variant={'whiteMain'} textColor={'grey'}>
          <Icon glyph='add' glyphColor='grey'/>
          <p>Добавить пару</p>
        </Button>}
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
              {getScheduleArray(weekSchedule).map((row, index) => (
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
                    <td key={dayNumber} onClick={day.length === 0 ? ()=>displayNewLesson(weekArray[dayNumber], CallSchedule[index]) : ()=>setSelectedLesson(day[0])}
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
        <div className={styles.mobileSchedule}>
          {getMobileWeekSchedule(weekSchedule).map((day)=>(
            <div className={styles.mobileSchedule__block} key={day.day}>
                <div className={styles.mobileSchedule__days}>
                  <p className={styles.mobileSchedule__day}>{day.day}</p>
                  <p className={styles.mobileSchedule__day}>{day.weekDay}</p>
                </div>
                <div className={styles.mobileSchedule__lessons}>
                  {day.list.map((lesson) => (
                    <div onClick={()=>setSelectedLesson(lesson)} key={lesson.id ? lesson.id : lesson.schedule_lesson_id} className={styles.mobileSchedule__info}>
                      <div className={styles.mobileSchedule__time}>
                        <p className={styles.mobileSchedule__number}>{`${getCallScheduleIndexFromTime([lesson.start_time, lesson.end_time]) + 1} пара`}</p>
                        <div>
                          {CallSchedule[getCallScheduleIndexFromTime([lesson.start_time, lesson.end_time])].split('-').map((time) => (
                            <p key={time}>{time}</p>
                          ))}
                        </div>
                      </div>
                      <p className={styles.mobileSchedule__lesson}>{lesson.lesson_name}</p>
                    </div>
                  ))}
                </div>
            </div>
          ))}
        </div>
      </div>
      {newLesson && subjects &&
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
          <div>
            <p className={styles.popup__text}>{`Дата: ${newLesson.date}`}</p>
            <p className={styles.popup__text}>{`Время: ${newLesson.time}`}</p>
            {role==='admin' &&<p className={styles.popup__text}>{`Преподаватель: ${newLesson.teacher}`}</p>}
          </div>
          <Input placeholder='Название пары' value={newLesson.name} onChange={(value)=>setNewLesson({...newLesson, name: value})}/>
          <div className={styles.popup__buttons}>
            <Button onClick={()=>setNewLesson(undefined)} size={'max'} variant={'whiteMain'}>Отмена</Button>
            <Button onClick={onCreateLesson} size={'max'} variant={'primary'}>Добавить</Button>
          </div>
        </div>
      </PopupContainer>}
      {mobileNewLesson && subjects &&
      <PopupContainer>
        <div className={styles.popup}>
          <h2 className={styles.popup__title}>Добавить пару</h2>
          <p className={styles.popup__text}>{`Преподаватель: ${mobileNewLesson.teacher}`}</p>
          <Input placeholder='Название пары' value={mobileNewLesson.name} onChange={(value)=>setMobileNewLesson({...mobileNewLesson, name: value})}/>
          <AddInput
            singleMode 
            totalParts={subjects.total_pages}
            currentPart={subjects.page_number}
            selectedList={mobileNewLesson.subject ? [mobileNewLesson.subject] : []} 
            placeholder='Введите название предмета' 
            allList={subjects.content} 
            onSearch={getSubjects} title='Предмет'
            changeInputList={(list)=>setMobileNewLesson({...mobileNewLesson, subject: list[0]})}
          />
          <Input placeholder='Введите дату' value={mobileNewLesson.date} type='date' onChange={(value)=>setMobileNewLesson({...mobileNewLesson, date: value})}/>
          <AddInput
            singleMode
            totalParts={1}
            currentPart={1}
            selectedList={mobileNewLesson.time ? [mobileNewLesson.time] : []}
            placeholder='Выберите время'
            changeInputList={(list)=>{setMobileNewLesson({...mobileNewLesson, time: list[0]})}}
            allList={CallSchedule.map((call, index)=>({name: `${index + 1} пара (${call})`, id: call}))}
            title='Выберите время'
          />
          <div className={styles.popup__buttons}>
            <Button onClick={()=>setMobileNewLesson(undefined)} size={'max'} variant={'whiteMain'}>Отмена</Button>
            <Button onClick={createMobileLesson} size={'max'} variant={'primary'}>Добавить</Button>
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
            <p className={styles.info__title}>{selectedLesson.rating}</p>
          </div>
          {selectedLesson.tags.length !==0 && 
          <div className={styles.lesson__info}>
            <p className={styles.info__title}>Тэги:</p>
            <div className={styles.info__list}>
              {selectedLesson.tags.map((tag)=>(
                <p key={tag} className={styles.info__tag}>{tag}</p>
              ))}
            </div>
          </div>}
          <div className={styles.lesson__info}>
          <Button onClick={()=>{setClosedLink(false)}} variant={'whiteMain'}>
              <Icon glyph='download'/>
              <p>Скачать qr-код</p>
            </Button>
            <Button onClick={()=>
              navigate(role === 'admin' ? `/teachers/${id}/schedule/${selectedLesson.id}/statistics` : 
              `/me/schedule/${selectedLesson.id}/statistics`)
            } variant={'primary'}>
              <p>Посмотреть статистику</p>
            </Button>
            <Button onClick={()=>{getMembersLesson(selectedLesson.id)}} variant={'primary'}>
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
      {selectedMembers &&
        <RightPopupContainer>
          <div className={styles.members}>
            <div className={styles.members__titleLine}>
              <div className={styles.members__titleBlock}>
                <Icon glyph='people'/>
                <h3 className={styles.members__title}>Посещаемость</h3>
              </div>
              <svg onClick={()=>setSelectedMembers(undefined)} className={styles.members__close} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F6F6F6" />
                <path d="M13.0599 12.0004L15.3599 9.70035C15.6499 9.41035 15.6499 8.93035 15.3599 8.64035C15.0699 8.35035 14.5899 8.35035 14.2999 8.64035L11.9999 10.9404L9.69986 8.64035C9.40986 8.35035 8.92986 8.35035 8.63986 8.64035C8.34986 8.93035 8.34986 9.41035 8.63986 9.70035L10.9399 12.0004L8.63986 14.3004C8.34986 14.5904 8.34986 15.0704 8.63986 15.3604C8.78986 15.5104 8.97986 15.5804 9.16986 15.5804C9.35986 15.5804 9.54986 15.5104 9.69986 15.3604L11.9999 13.0604L14.2999 15.3604C14.4499 15.5104 14.6399 15.5804 14.8299 15.5804C15.0199 15.5804 15.2099 15.5104 15.3599 15.3604C15.6499 15.0704 15.6499 14.5904 15.3599 14.3004L13.0599 12.0004Z" fill="#DDDDDD" />
              </svg>
            </div>
            <div className={styles.members__textBlock}>
              {selectedMembers.map((member) => (
                <div key={`${member.name}--${member.created_at}`} className={styles.members__text}>
                  <p>{member.name}</p>
                  <p>{convertTime(member.created_at)}</p>
                </div>
              ))}
            </div>
            {selectedMembers.length !== 0 &&<Button style={{marginTop: '24px'}} onClick={getMembersExcel} size={'max'} variant={'primary'}>Экспортировать в exel</Button>}
          </div>
        </RightPopupContainer>
      }
    </>
  )
}