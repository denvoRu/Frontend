import { Helmet } from 'react-helmet-async'
import styles from './entities.module.scss'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { Button } from '../../components/button/button'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useEffect, useState } from 'react'
import PopupContainer from '../../components/popupContainer/popupContainer'
import {Input} from '../../components/input/Input'
import axios, { PagesURl } from '../../services/api';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Privileges, PrivilegeValues, Teacher } from '../../types/teacher'
import { getNameByAllNames } from '../../utils/teacher'
import { PRIVILEGES } from '../../consts/privileges'
import EntitiesList from '../../components/entitiesList/entitiesList'
import { Subjects } from '../../types/subject'
import { LIST_LIMIT } from '../../consts/limit'
import { removeElementAtIndex } from '../../utils'

export default function TeacherPage() {

  const params = useParams()
  const navigate = useNavigate()

  const teacherId = params.id
  const [teacher, setTeacher] = useState<Teacher>()
  const [subjects, setSubjects] = useState<Subjects>()
  const [newSubjects, setNewSubjects] = useState<Subjects>()

  const [privileges, setPrivileges] = useState<Privileges>(PRIVILEGES)
  const [isOpenPrivileges, setIsOpenPrivileges] = useState(false)

  const [displayDeletePopup, setDisplayDeletePopup] = useState (false)
  const [displayChangePopup, setDisplayChangePopup] = useState(false)
  const [changeData, setChangeData] = useState({name: 'Иванов Иван Иванович', email: 'example@gmail.com'})


  const getTeacherPrivileges = async () => {
    try {
      const response = await axios.get<PrivilegeValues[]>(PagesURl.TEACHER + `/${teacherId}/privilege`)
      const newPrivileges = [...privileges]
      for (const privilege of response.data){
        for (const defaultPrivilege of newPrivileges){
          if (privilege === defaultPrivilege.name){
            defaultPrivilege.isActive = true
          }
        }
      }
      setPrivileges(newPrivileges)
    } catch (error) {
      console.log(error)
    }
  }
  const changeTeacherPrivileges = async (privilege: PrivilegeValues, isAdd: boolean) => {
    try {
      if (isAdd) {
        await axios.post(PagesURl.TEACHER + `/${teacherId}/privilege/${privilege}`)
      } else {
        await axios.delete(PagesURl.TEACHER + `/${teacherId}/privilege/${privilege}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTeacher = async () => {
    try {
      await axios.delete(PagesURl.TEACHER + `/${teacherId}`)
      setDisplayDeletePopup(false)
      navigate('/teachers')
    } catch (error) {
      console.log(error)
    }
  }

  const getTeacher = async () => {
    try {
      const response = await axios.get<Teacher>(PagesURl.TEACHER + `/${teacherId}`)
      getNameByAllNames(response.data)
      setTeacher(response.data)
      getTeacherPrivileges()
    } catch (error) {
      console.log(error)
    }
  }
  const onChangePrivileges = (value: string) => {
    const newPrivileges = privileges.slice()
    for (const privilege of newPrivileges) {
      if (privilege.value === value){
        changeTeacherPrivileges(privilege.name, !privilege.isActive)
        privilege.isActive = !privilege.isActive
        setPrivileges(newPrivileges)
        continue
      }
    }

  }
  const getSubjects = async (page?: number) => {
    try {
      const {data} = await axios.get<Subjects>(PagesURl.SUBJECT,{
        params: {
          teacher_ids: teacherId,
          limit: LIST_LIMIT,
          page: page
        }
      })
      if (page && subjects) {
        setSubjects({...data, content: [...subjects.content, ...data.content]})
      } else {
        setSubjects(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getNewSubjects = async (search?: string) => {
    try {
      const {data} = await axios.get<Subjects>(PagesURl.SUBJECT,{
        params: {
          subject_without_teacher_by_id: teacherId,
          limit: LIST_LIMIT,
          search: search ? search : undefined
        }
      })
      setNewSubjects(data)
    } catch (error) {
      console.log(error)
    }
  }
  const deleteSubjectFromTeacher = async (id: string) => {
    try {
      await axios.delete(PagesURl.SUBJECT + `/${id}/teachers/${teacherId}`)
      if (!subjects){
        return
      }
      let newContent = subjects.content.slice()
      newContent = removeElementAtIndex(newContent, newContent.findIndex(item=>item.id === id))
      setSubjects({...subjects, content: newContent})
      getNewSubjects()
    } catch (error) {
      console.log(error)
    }
  }
  const addNewSubjects = async (list: string[]) => {
    try {
      await axios.post(PagesURl.TEACHER + `/${teacherId}/subjects`,[...list])
      getSubjects()
      getNewSubjects()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getTeacher()
    getSubjects()
    getNewSubjects()
  },[])

  if (!teacher || !subjects || !newSubjects) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>{teacher.name}</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramNames={[{name: teacher.name, id: teacher.id}]} />
        <div className={styles.settings}>
          <div className={styles.settings__controls}>
          <Button variant={'whiteMain'}>
              <Link className={styles.settings__schedule} to={`/teachers/${teacherId}/schedule`}>
                <Icon glyph='schedule' glyphColor='grey'/>
                <p className={styles.settings__button}>Полное расписание</p>
              </Link>
            </Button>
            <SortBlock 
              alwaysDisplayTitle
              isOpenList={isOpenPrivileges} 
              changeIsOpenList={()=>{setIsOpenPrivileges(!isOpenPrivileges)}} 
              titlePadding={24.5} title='Привилегии' icon='privilege' type='checkbox' list={privileges} onChange={onChangePrivileges}
            />
            {/* <Button onClick={()=>{setDisplayChangePopup(true)}} variant={'whiteMain'}>
              <>
                <Icon glyph='edit' glyphColor='grey' />
                <p className={styles.settings__button}>Изменить пароль</p>
              </>
            </Button> */}
          </div>
          <Button onClick={()=>{setDisplayDeletePopup(true)}} variant={'whiteMain'}>
            <>
              <Icon glyph='trash' glyphColor='dangerous' />
              <p className={`${styles.settings__button} ${styles.settings__button_red}`}>Удалить</p>
            </>
          </Button>
        </div>
        <div className={`${styles.container__block} ${styles.info} ${isOpenPrivileges ? styles.container__block_opacity : ''}`}>
          <div>
            <div className={styles.info__block}>
              <Icon glyph='teacher' />
              <h1 className={styles.info__name}>{teacher.name}</h1>
            </div>
            <p className={styles.info__email}>{teacher.email}</p>
          </div>
          <p className={styles.info__raiting}><span className={styles.info__raiting_text}>Рейтинг:</span>{` ${teacher.rating}`}</p>
        </div>
        <EntitiesList
          displayOpacity={isOpenPrivileges}
          icon='subject'
          title='Предметы'
          subtitle='Добавить предмет из списка'
          list={subjects.content}
          addList={newSubjects.content}
          changeSearchValue={getNewSubjects}
          showMore={getSubjects}
          deleteItem={deleteSubjectFromTeacher}
          onConfirmChanges={addNewSubjects}
          totalPages={subjects.total_pages}
        />
      </div>
      {displayChangePopup && <PopupContainer>
        <div className={styles.popup}>
          <h2 className={styles.popup__title}>Изменить информацию о преподавателе</h2>
          <Input placeholder='Введите новое ФИО преподавателя' value={changeData.name} onChange={(value)=>{setChangeData({...changeData, name: value})}}/>
          <Input placeholder='Введите новую почту преподавателя ' value={changeData.email} onChange={(value)=>{setChangeData({...changeData, email: value})}}/>
          <div className={styles.popup__buttons}>
            <Button onClick={()=>{setDisplayChangePopup(false)}} style={{flex: '1'}} variant='whiteMain'>Отменить</Button>
            <Button style={{flex: '1'}} variant='primary'>Сохранить</Button>
          </div>
        </div>
      </PopupContainer>}
      {displayDeletePopup && <PopupContainer>
        <div className={styles.deletePopup}>
          <h2 className={styles.deletePopup__title}>Удалить преподавателя</h2>
          <p className={styles.deletePopup__text}>Вы дейсвительно хотите удалить преподавателя без возможности восстановления?</p>
          <div className={styles.popup__buttons}>
            <Button onClick={()=>{setDisplayDeletePopup(false)}} size='max' variant='whiteMain'><span className={styles.deletePopup__text_grey}>Отменить</span></Button>
            <Button onClick={deleteTeacher} size={'max'} variant='secondary'>Удалить</Button>
          </div>
        </div>
        </PopupContainer>}
    </>
  )
}