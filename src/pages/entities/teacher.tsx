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
import { getRole, removeRole } from '../../services/role'
import { removeTokensFromCookies } from '../../services/token'
import { removeInstituteId } from '../../services/institute'

export default function TeacherPage() {

  const params = useParams()
  const navigate = useNavigate()

  const role = getRole()

  const teacherId = params.id
  const [teacher, setTeacher] = useState<Teacher>()
  const [subjects, setSubjects] = useState<Subjects>()
  const [newSubjects, setNewSubjects] = useState<Subjects>()

  const [displaySubjectsRating, setDisplaySubjectRating] = useState(false)

  const [privileges, setPrivileges] = useState<Privileges>(PRIVILEGES)
  const [isOpenPrivileges, setIsOpenPrivileges] = useState(false)

  const [displayDeletePopup, setDisplayDeletePopup] = useState (false)
  const [displayChangePopup, setDisplayChangePopup] = useState(false)
  const [changeData, setChangeData] = useState({name: 'Иванов Иван Иванович', email: 'example@gmail.com'})

  const logOut = () => {
    removeRole()
    removeTokensFromCookies('access')
    removeTokensFromCookies('refresh')
    removeInstituteId()
    navigate('/login')
  }

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

/*   const changeTeacherName = async (newName: string) => {
    try {
      await axios.patch(PagesURl.TEACHER, {

      })
    } catch (error) {
      console.log(error)
    }
  } */

  const getTeacher = async () => {
    try {
      const response = await axios.get<Teacher>(PagesURl.TEACHER + `/${role === 'admin' ? teacherId : 'me'}`)
      getNameByAllNames(response.data)
      setTeacher(response.data)
      console.log(response)
      if (role === 'admin') {
        getTeacherPrivileges()
      }
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
      const {data} = await axios.get<Subjects>(role === 'admin' ? PagesURl.SUBJECT : PagesURl.TEACHER + `/me/subject`,{
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
    if (role === 'admin') {
      getNewSubjects()
    }
  },[])

  if (!teacher || !subjects) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>{teacher.name}</title>
      </Helmet>
      <div className={styles.container}>
        {role === 'admin' && <LocationLinks paramNames={[{name: teacher.name, id: teacher.id}]} />}
        <div className={styles.settings}>
          <div className={styles.settings__controls}>
          <Button variant={'whiteMain'}>
              <Link className={styles.settings__schedule} to={role === 'admin' ? `/teachers/${teacherId}/schedule` : `/me/schedule`}>
                <Icon glyph='schedule' glyphColor='grey'/>
                <p className={styles.settings__button}>{`${role === 'admin' ? 'Полное' : 'Мое'} расписание`}</p>
              </Link>
            </Button>
            {role === 'admin' && <SortBlock  
              alwaysDisplayTitle
              isOpenList={isOpenPrivileges} 
              changeIsOpenList={()=>{setIsOpenPrivileges(!isOpenPrivileges)}} 
              title='Привилегии' icon='privilege' type='checkbox' list={privileges} onChange={onChangePrivileges}
            />}
            {/* <Button onClick={()=>{setDisplayChangePopup(true)}} variant={'whiteMain'}>
              <>
                <Icon glyph='edit' glyphColor='grey' />
                <p className={styles.settings__button}>Изменить пароль</p>
              </>
            </Button> */}
          </div>
          <Button onClick={role === 'admin' ? ()=>{setDisplayDeletePopup(true)} : logOut} variant={'whiteMain'}>
            <>
              {role === 'admin' && <Icon glyph='trash' glyphColor='dangerous' />}
              <p className={`${styles.settings__button} ${role === 'admin' && styles.settings__button_hideMobile } ${styles.settings__button_red}`}>{role === 'admin' ? 'Удалить' : 'Выйти'}</p>
            </>
          </Button>
        </div>
        <div className={`${styles.container__block} ${styles.info} ${isOpenPrivileges ? styles.container__block_opacity : ''}`}>
          <div>
            <div className={styles.info__block}>
              <Icon glyph='teacher' />
              <h1 className={styles.info__name}>{teacher.name}</h1>
              {/* <input style={{width: `${teacher.name.length}ch`}} className={styles.info__name} value={teacher.name} /> */}
            </div>
            <p className={styles.info__email}>{teacher.email}</p>
          </div>
          {teacher.rating !== undefined &&
          <p 
            onClick={role === 'teacher' ? ()=>setDisplaySubjectRating(true) : undefined} 
            className={`${styles.info__raiting} ${role==='teacher' && styles.info__raiting_teacher}`}>
            <span className={`${styles.info__raiting_text}`}>Рейтинг:</span>
            {teacher.rating}
          </p>
          }
        </div>
        {subjects && 
        <EntitiesList
          displayOpacity={isOpenPrivileges}
          icon='subject'
          title='Предметы'
          subtitle='Добавить предмет из списка'
          list={subjects.content}
          addList={newSubjects ? newSubjects.content : undefined}
          changeSearchValue={getNewSubjects}
          onNavigateSchedule={(id)=>navigate(role === 'admin' ? `/teachers/${teacher.id}/schedule/${id}` : `/me/schedule/${id}`)}
          showMore={getSubjects}
          deleteItem={deleteSubjectFromTeacher}
          onConfirmChanges={addNewSubjects}
          totalPages={subjects.total_pages}
        />}
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
      {displaySubjectsRating && 
        <div className={styles.rating}>
          <div className={styles.rating__content}>
            <div className={styles.rating__closeBlock}>
              <svg onClick={()=>setDisplaySubjectRating(false)} className={styles.rating__close} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#F6F6F6" />
                <path d="M13.0604 11.9994L15.3604 9.69937C15.6504 9.40937 15.6504 8.92937 15.3604 8.63938C15.0704 8.34938 14.5904 8.34938 14.3004 8.63938L12.0004 10.9394L9.70035 8.63938C9.41035 8.34938 8.93035 8.34938 8.64035 8.63938C8.35035 8.92937 8.35035 9.40937 8.64035 9.69937L10.9404 11.9994L8.64035 14.2994C8.35035 14.5894 8.35035 15.0694 8.64035 15.3594C8.79035 15.5094 8.98035 15.5794 9.17035 15.5794C9.36035 15.5794 9.55035 15.5094 9.70035 15.3594L12.0004 13.0594L14.3004 15.3594C14.4504 15.5094 14.6404 15.5794 14.8304 15.5794C15.0204 15.5794 15.2104 15.5094 15.3604 15.3594C15.6504 15.0694 15.6504 14.5894 15.3604 14.2994L13.0604 11.9994Z" fill="#DDDDDD" />
              </svg>
            </div>
            <div className={styles.rating__line}>
              <div className={styles.rating__title}>
                <Icon glyph='rating'/>
                <h2>Мой рейтинг</h2>
              </div>
              <h2 className={styles.rating__value}>{teacher.rating}</h2>
            </div>
            <div className={styles.rating__list}>
              {subjects.content.map((subject)=>(
                <div style={{ width: `${subject.rating*20 < 45 ? '45%' : `${subject.rating*20}%`}` }} key={subject.id} className={styles.rating__rating}>
                  <p>{subject.name}</p>
                  <p>{subject.rating}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </>
  )
}