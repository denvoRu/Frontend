import { Helmet } from 'react-helmet-async'
import styles from './entities.module.scss'
import { Link, useParams } from 'react-router-dom'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { Button } from '../../components/button/button'
import { Icon } from '../../components/icon'
import { useState } from 'react'
import PopupContainer from '../../components/popupContainer/popupContainer'
import {AddInput, Input} from '../../components/input/Input'

export default function Teacher() {

  const params = useParams()

  const [displayDeletePopup, setDisplayDeletePopup] = useState (false)
  const [displayChangePopup, setDisplayChangePopup] = useState(false)

  const [displayAddTeacher, setDisplayAddTeacher] = useState(false)
  const [newTeachers, setNewTeachers] = useState<string[]>([])

  const [changeData, setChangeData] = useState({name: 'Предмет'})

  return (
    <>
      <Helmet>
        <title>Предмет</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramName='Предмет' />
        <div className={styles.settings}>
          <div className={styles.settings__controls}>
            <Button onClick={()=>{setDisplayChangePopup(true)}} variant={'whiteMain'}>
              <>
                <Icon glyph='edit' glyphColor='grey' />
                <p className={styles.settings__button}>Изменить</p>
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
        <div className={`${styles.container__block} ${styles.info}`}>
          <div>
            <div className={styles.info__block}>
              <Icon glyph='subject' />
              <h1 className={styles.info__name}>Предмет</h1>
            </div>
          </div>
          <p className={styles.info__raiting}><span className={styles.info__raiting_text}>Рейтинг:</span>{` ${99}`}</p>
        </div>
        <div className={`${styles.container__block} ${styles.subjects}`}>
          <div className={styles.subjects__line}>
            <div className={styles.subjects__block}>
              <Icon glyph='teacher' />
              <h1 className={styles.subjects__title}>Преподаватели</h1>
            </div>
            <Button onClick={()=>{setDisplayAddTeacher(true)}} variant={'whiteMain'}>
              <p className={styles.subjects__button}>Добавить</p>
              <Icon glyph='add' />
            </Button>
          </div>
          <div className={styles.table}>
            <div className={styles.table__row}>
              <p className={styles.table__name}>Фамилия Имя Отчество</p>
              <Button variant={'whiteMain'}>
                <Link to={`/teachers/2`} className={styles.table__buttonContainer}>
                  <p className={styles.table__button}>Перейти <span className={styles.table__button_mobileHide}>на страницу</span></p>
                  <Icon glyph='arrow-right' />
                </Link>
              </Button>
            </div>
            <div className={styles.table__showMore}>
              <Button variant={'whiteMain'}>
                <p className={styles.subjects__button}>Посмотреть еще</p>
                <Icon glyph='arrow-down' />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {displayChangePopup && <PopupContainer>
        <div className={styles.popup}>
          <h2 className={styles.popup__title}>Изменить информацию о предмете</h2>
          <Input placeholder='Введите новое название предмета' value={changeData.name} onChange={(value)=>{setChangeData({...changeData, name: value})}}/>
          <div className={styles.popup__buttons}>
            <Button onClick={()=>{setDisplayChangePopup(false)}} style={{flex: '1'}} variant='whiteMain'>Отменить</Button>
            <Button style={{flex: '1'}} variant='primary'>Сохранить</Button>
          </div>
        </div>
      </PopupContainer>}
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
      {displayAddTeacher && 
        <PopupContainer>
          <div className={styles.deletePopup}>
            <h2 className={styles.deletePopup__title}>Добавить преподавателя</h2>
            <AddInput title='Выбрать преподавателя из списка' placeholder='Введите ФИО преподавателя' 
              allList={['Фамилия Имя Отчество1','Фамилия Имя Отчество2','Фамилия Имя Отчество3']}
              selectedList={newTeachers}
              changeInputList={setNewTeachers}/>
            <div className={styles.popup__buttons}>
              <Button onClick={()=>{setDisplayAddTeacher(false);setNewTeachers([])}} style={{flex: '1'}} variant='whiteMain'>Отменить</Button>
              <Button style={{flex: '1'}} variant='primary'>Добавить</Button>
          </div>
          </div>
        </PopupContainer>
      }
    </>
  )
}