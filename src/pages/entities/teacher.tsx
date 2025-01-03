import { Helmet } from 'react-helmet-async'
import styles from './entities.module.scss'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { Button } from '../../components/button/button'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useCallback, useEffect, useState } from 'react'
import PopupContainer from '../../components/popupContainer/popupContainer'
import {Input} from '../../components/input/Input'
import axios, { PagesURl } from '../../services/api';
import { useParams } from 'react-router-dom'
import { Privilege, Teacher } from '../../types/teacher'
import { getNameByAllNames } from '../../utils/teacher'

export default function TeacherPage() {

  const params = useParams()

  const [teacherId, setTeacherId] = useState<string>()
  const [teacher, setTeacher] = useState<Teacher>()

  const [privileges, setPrivileges] = useState<{value:Privilege, isActive: boolean}[]>([])
  const [isOpenPrivileges, setIsOpenPrivileges] = useState(false)

  const [displayDeletePopup, setDisplayDeletePopup] = useState (false)
  const [displayChangePopup, setDisplayChangePopup] = useState(false)
  const [changeData, setChangeData] = useState({name: 'Иванов Иван Иванович', email: 'example@gmail.com'})


  const getTeacherPrivileges = async () => {
    try {
      const response = await axios.get<Teacher>(PagesURl.TEACHER + `/${teacherId}/privilege`)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const getTeacher = useCallback( async () => {
    try {
      const response = await axios.get<Teacher>(PagesURl.TEACHER + `/${teacherId}`)
      console.log(response)
      getNameByAllNames(response.data)
      setTeacher(response.data)
      getTeacherPrivileges()
    } catch (error) {
      console.log(error)
    }
  }, [teacherId])

  const onChangePrivileges = (value: string) => {
    const newPrivileges = privileges.slice()
    for (const privilege of newPrivileges) {
      if (privilege.value === value){
        privilege.isActive = !privilege.isActive
        setPrivileges(newPrivileges)
        return
      }
    }
  }

  useEffect(()=>{
    if (teacherId) {
      getTeacher()
    }
  },[getTeacher, teacherId])

  useEffect(()=>{
    if (params.id) {
      setTeacherId(params.id)
    }
  },[params])

  if (!teacher) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>{teacher.name}</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramName={teacher.name} />
        <div className={styles.settings}>
          <div className={styles.settings__controls}>
            <SortBlock 
              isOpenList={isOpenPrivileges} 
              changeIsOpenList={()=>{setIsOpenPrivileges(!isOpenPrivileges)}} 
              titlePadding={24.5} title='Привилегии' icon='privilege' type='checkbox' list={privileges} onChange={onChangePrivileges}
            />
            <Button onClick={()=>{setDisplayChangePopup(true)}} variant={'whiteMain'}>
              <>
                <Icon glyph='edit' glyphColor='grey' />
                <p className={styles.settings__button}>Изменить пароль</p>
              </>
            </Button>
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
        <div className={`${styles.container__block} ${styles.subjects} ${isOpenPrivileges ? styles.container__block_opacity : ''}`}>
          <div className={styles.subjects__line}>
            <div className={styles.subjects__block}>
              <Icon glyph='subject' />
              <h1 className={styles.subjects__title}>Предметы</h1>
            </div>
            <Button variant={'whiteMain'}>
              <p className={styles.subjects__button}>Добавить</p>
              <Icon glyph='add' />
            </Button>
          </div>
          <div className={styles.table}>
            <div className={styles.table__row}>
              <p className={styles.table__name}>Предмет</p>
              <Button variant={'whiteMain'}>
                <div className={styles.table__buttonContainer}>
                  <p className={styles.table__button}>Расписание</p>
                  <Icon glyph='arrow-right' />
                </div>
              </Button>
            </div>
            <div className={styles.table__row}>
              <p className={styles.table__name}>Предмет</p>
              <Button variant={'whiteMain'}>
                <div className={styles.table__buttonContainer}>
                  <p className={styles.table__button}>Расписание</p>
                  <Icon glyph='arrow-right' />
                </div>
              </Button>
            </div>
            <div className={styles.table__row}>
              <p className={styles.table__name}>Предмет</p>
              <Button variant={'whiteMain'}>
                <div className={styles.table__buttonContainer}>
                  <p className={styles.table__button}>Расписание</p>
                  <Icon glyph='arrow-right' />
                </div>
              </Button>
            </div>
            <div className={styles.table__showMore}>
              <Button variant={'whiteMain'}>
                <p className={styles.subjects__button}>Посмотреть еще 3 предмета</p>
                <Icon glyph='arrow-down' />
              </Button>
            </div>
          </div>
        </div>
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
            <Button onClick={()=>{setDisplayDeletePopup(false)}} style={{flex: '1'}} variant='whiteMain'><span className={styles.deletePopup__text_grey}>Отменить</span></Button>
            <Button style={{flex: '1'}} variant='secondary'>Удалить</Button>
          </div>
        </div>
        </PopupContainer>}
    </>
  )
}