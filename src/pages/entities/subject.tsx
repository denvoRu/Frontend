import { Helmet } from 'react-helmet-async'
import styles from './entities.module.scss'
import { useParams } from 'react-router-dom'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { Button } from '../../components/button/button'
import { Icon } from '../../components/icon'
import { useEffect, useState } from 'react'
import PopupContainer from '../../components/popupContainer/popupContainer'
import axios, { PagesURl } from '../../services/api';
import { Subject } from '../../types/subject'
import { Module } from '../../types/module'
import EntitiesList from '../../components/entitiesList/entitiesList'
import { LIMIT, LIST_LIMIT } from '../../consts/limit'
import { Teachers } from '../../types/teacher'
import { getNameByAllNames } from '../../utils/teacher'
import { removeElementAtIndex } from '../../utils'

export default function SubjectPage() {

  const {subjectId, id} = useParams()
 
  const [subject, setSubject] = useState<Subject>()
  const [moduleName, setModuleName] = useState<string>()
  const [teachers, setTeachers] = useState<Teachers>()
  const [newTeachers, setNewTeachers] = useState<Teachers>()

  const [displayDeletePopup, setDisplayDeletePopup] = useState(false)

  const [isActiveInput, setIsActiveInput] = useState(false)

  const addTeachersToSubject = async (list: string[]) => {
    try {
      await axios.post(PagesURl.SUBJECT + `/${subjectId}/teachers`,[...list])
      getTeachers()
      getNewTeachers()
    } catch (error) {
      console.log(error)
    }
  }
  const getSubject = async () => {
    try {
      const response = await axios.get<Subject>(PagesURl.SUBJECT + `/${subjectId}`)
      setSubject(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getModuleName = async () => {
    try {
      const response = await axios.get<Module>(PagesURl.MODULE + `/${id}`)
      setModuleName(response.data.name)
    } catch (error) {
      console.log(error)
    }
  }
  const getTeachers = async (page?: number) => {
    try {
      const {data} = await axios.get<Teachers>(PagesURl.SUBJECT + `/${subjectId}/teachers`, {
        params: {
          limit: LIMIT,
          page: page
        }
      })
      data.content.forEach((teacher) => (
        getNameByAllNames(teacher)
      ))
      if (page && teachers) {
        setTeachers({...data, content: [...teachers.content, ...data.content]})
      } else {
        setTeachers(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getNewTeachers = async (search?: string) => {
    try {
      const {data} = await axios.get<Teachers>(PagesURl.TEACHER,{
        params: {
          not_in_subject_by_id: subjectId,
          limit: LIST_LIMIT,
          search: search ? search : undefined
        }
      })
      data.content.forEach((teacher) => (
        getNameByAllNames(teacher)
      ))
      setNewTeachers(data)
    } catch (error) {
      console.log(error)
    }
  }
  const deleteTeacherFromSubject = async (id: string) => {
    try {
      await axios.delete(PagesURl.TEACHER,{
        params: {
          subject_id: subjectId,
          teacher_id: id
        }
      })
      if (!teachers){
        return
      }
      let newContent = teachers.content.slice()
      newContent = removeElementAtIndex(newContent, newContent.findIndex(item=>item.id === id))
      setTeachers({...teachers, content: newContent})
      getNewTeachers()
    } catch (error) {
      console.log(error)
    }
  }
  const changeSubjectName = async (newName: string) => {
    setIsActiveInput(false)
    try {
      await axios.patch(PagesURl.SUBJECT + `/${subjectId}`, {
        name: newName
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getModuleName()
    getSubject()
    getTeachers()
    getNewTeachers()
  },[])

  if (!moduleName || !subject || !teachers || !newTeachers) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>{subject.name}</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramNames={[{name: moduleName, id: id ? id : ''}, {name: subject.name, id: subjectId ? subjectId : ''}]} />
        <div style={{justifyContent: 'flex-end'}}  className={styles.settings}>
          <Button onClick={()=>{setDisplayDeletePopup(true)}} variant={'whiteMain'}>
            <>
              <Icon glyph='trash' glyphColor='dangerous' />
              <p className={`${styles.settings__button} ${styles.settings__button_red}`}>Удалить</p>
            </>
          </Button>
        </div>
        <div className={`${styles.container__block} ${styles.info}`}>
          <div>
            <div className={styles.info__block}>
              <Icon glyph='subject' />
              {isActiveInput ? <input 
                onBlur={(e)=>changeSubjectName(e.target.value)}
                onChange={(e)=>{setSubject({...subject, name: e.target.value})}} 
                style={{width: `${Math.min(subject.name.length + 1, 30)}`}} className={styles.info__name} value={subject.name} 
              /> :<h1 onClick={()=>setIsActiveInput(true)} className={styles.info__name}>{subject.name}</h1>}
            </div>
            <p className={styles.info__module}>{moduleName}</p>
          </div>
          <p className={styles.info__raiting}><span className={styles.info__raiting_text}>Рейтинг:</span>{` ${subject.rating}`}</p>
        </div>
        <EntitiesList
          icon='teacher'
          title='Преподаватели'
          subtitle='Добавить преподавателя из списка'
          list={teachers.content}
          addList={newTeachers.content}
          changeSearchValue={getNewTeachers}
          showMore={getTeachers}
          deleteItem={deleteTeacherFromSubject}
          onConfirmChanges={addTeachersToSubject}
          totalPages={teachers.total_pages}
        />
      </div>
      {displayDeletePopup && <PopupContainer>
        <div className={styles.deletePopup}>
          <h2 className={styles.deletePopup__title}>Удалить предмет</h2>
          <p className={styles.deletePopup__text}>Вы дейсвительно хотите удалить предмет без возможности восстановления?</p>
          <div className={styles.popup__buttons}>
            <Button onClick={()=>{setDisplayDeletePopup(false)}} style={{flex: '1'}} variant='whiteMain'><span className={styles.deletePopup__text_grey}>Отменить</span></Button>
            <Button style={{flex: '1'}} variant='secondary'>Удалить</Button>
          </div>
        </div>
        </PopupContainer>
      }
    </>
  )
}