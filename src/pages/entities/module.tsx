import { Helmet } from 'react-helmet-async'
import styles from './entities.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import LocationLinks from '../../components/locationLinks/locationLinks'
import { Button } from '../../components/button/button'
import { Icon } from '../../components/icon'
import { useEffect, useState } from 'react'
import PopupContainer from '../../components/popupContainer/popupContainer'
import axios, { PagesURl } from '../../services/api';
import { Module } from '../../types/module'
import { Subjects } from '../../types/subject'
import EntitiesList from '../../components/entitiesList/entitiesList'
import { LIST_LIMIT } from '../../consts/limit'
import { removeElementAtIndex } from '../../utils'

export default function ModulePage() {

  const {id} = useParams()

  const navigate = useNavigate()

  const [module, setModule] = useState<Module>()
  const [moduleSubjects, setModuleSubjects] = useState<Subjects>()
  const [newSubjects, setNewSubjects] = useState<Subjects>()

  const [displayDeletePopup, setDisplayDeletePopup] = useState(false)
  const [subjectIdToDelete, setSubjectIdToDelete] = useState<string>()

  const getModuleSubjects = async (page?:number) => {
    try {
      const {data} = await axios.get<Subjects>(PagesURl.SUBJECT,{
        params: {
          module_id: id,
          limit: LIST_LIMIT,
          page: page
        }
      })
      if (page && moduleSubjects) {
        setModuleSubjects({...data, content: [...moduleSubjects.content, ...data.content]})
      } else {
        setModuleSubjects(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getNewSubjects = async (search?: string) => {
    try {
      const {data} = await axios.get<Subjects>(PagesURl.SUBJECT,{
        params: {
          not_in_module_by_id: id,
          limit: LIST_LIMIT,
          search: search ? search : undefined
        }
      })
      setNewSubjects(data)
    } catch (error) {
      console.log(error)
    }
  }

  const getModule = async () => {
    try {
      const {data} = await axios.get<Module>(PagesURl.MODULE + `/${id}`)
      setModule(data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteModule = async () => {
    try {
      await axios.delete(PagesURl.MODULE + `/${id}`)
      navigate('/modules')
    } catch (error) {
      console.log(error)
    }
  }
  const deleteSubject = async (id: string) => {
    try {
      await axios.delete(PagesURl.SUBJECT + `/${id}`)
      if (!moduleSubjects){
        return
      }
      let newContent = moduleSubjects.content.slice()
      newContent = removeElementAtIndex(newContent, newContent.findIndex(item=>item.id === id))
      setModuleSubjects({...moduleSubjects, content: newContent})
      setSubjectIdToDelete(undefined)
      getNewSubjects()
    } catch (error) {
      console.log(error)
    }
  }
  const onClickDeleteSubject = (id: string) => {
    setSubjectIdToDelete(id)
  }

  useEffect(()=>{
    getModule()
    getModuleSubjects()
    getNewSubjects()
  },[])

  if (!module || !moduleSubjects || !newSubjects) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>{module.name}</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramNames={[{name: module.name, id: module.id}]} />
        <div style={{justifyContent: 'flex-end'}} className={styles.settings}>
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
              <Icon glyph='module' />
              <h1 className={styles.info__name}>{module.name}</h1>
            </div>
          </div>
          <p className={styles.info__raiting}><span className={styles.info__raiting_text}>Рейтинг:</span>{` ${module.rating}`}</p>
        </div>
        <EntitiesList icon='subject' title='Предметы' subtitle='Добавить предмет из списка'
          list={moduleSubjects.content.map((subject)=>({name: subject.name, id: subject.id, rating: subject.rating}))}
          addList={newSubjects.content.map((subject)=>({name: subject.name, id: subject.id, rating: subject.rating}))}
          changeSearchValue={getNewSubjects}
          totalPages={moduleSubjects.total_pages}
          showMore={getModuleSubjects}
          deleteItem={onClickDeleteSubject}/>
      </div>
      {displayDeletePopup && <PopupContainer>
        <div className={styles.deletePopup}>
          <h2 className={styles.deletePopup__title}>Удалить модуль</h2>
          <p className={styles.deletePopup__text}>Вы дейсвительно хотите удалить модуль без возможности восстановления?</p>
          <div className={styles.popup__buttons}>
            <Button onClick={()=>{setDisplayDeletePopup(false)}} textColor={'grey'} size={'max'} variant='whiteMain'>Отменить</Button>
            <Button onClick={deleteModule} size={'max'} variant='secondary'>Удалить</Button>
          </div>
        </div>
        </PopupContainer>
      }
      {subjectIdToDelete && <PopupContainer>
        <div className={styles.deletePopup}>
          <h2 className={styles.deletePopup__title}>Удалить предмет</h2>
          <p className={styles.deletePopup__text}>Вы дейсвительно хотите удалить предмет без возможности восстановления?</p>
          <div className={styles.popup__buttons}>
            <Button onClick={()=>{setSubjectIdToDelete(undefined)}} textColor={'grey'} size={'max'} variant='whiteMain'>Отменить</Button>
            <Button onClick={()=>deleteSubject(subjectIdToDelete)} size={'max'} variant='secondary'>Удалить</Button>
          </div>
        </div>
        </PopupContainer>
      }
    </>
  )
}