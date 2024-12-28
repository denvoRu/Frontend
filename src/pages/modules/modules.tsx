import { Helmet } from 'react-helmet-async'
import styles from '../list.module.scss'
import subjectStyles from './modules.module.scss'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { AddInput, Input } from '../../components/input/Input'
import { useEffect, useState } from 'react'
import SortBlock from '../../components/sortBlock/sortBlock'
import { ALPHABET_LIST } from '../../consts/alphabetList'
import { updateRadioButtonList } from '../../utils/list'
import { Icon } from '../../components/icon'
import { Button } from '../../components/button/button'
import PopupContainer from '../../components/popupContainer/popupContainer'
import Table from '../../components/table/table'
import Filter from '../../components/filter/filter'
import RightPopupContainer from '../../components/rightPopupContainer/rightPopupContainer'
import { FilterParams, FilterType } from '../../types/filter'
import axios, { PagesURl } from '../../services/api';
import { Modules, ModulesWithSubjects } from '../../types/module'
import { getInstituteId } from '../../services/institute'
import { Teachers } from '../../types/teacher'
import { LIST_LIMIT } from '../../consts/limit'
import { getNameByAllNames } from '../../utils/teacher'

export default function Subjects() {

  const [searchValue, setSearchValue] = useState('')
  const [searchTeacherValue, setSearchSubjectValue] = useState('')
  const [sortList, setSortList] = useState(ALPHABET_LIST)
  const [teachers, setTeachers] = useState<Teachers>()
  const [modules, setModules] = useState<ModulesWithSubjects>()

  const [addSubjectModules, setAddSubjectModules] = useState<Modules>()

  const [displaySettings, setDisplaySettings] = useState(false)
  const [addModulePopup, setAddModulePopup] = useState(false)
  const [addSubjectPopup, setAddSubjectPopup] = useState(false)

  const [addSubjectValues, setAddSubjectValues] = useState<{name: string, module: string, teachers: string[]}>({name: '', module: '', teachers: []})

  const [displayFilters, setDisplayFilters] = useState(false)

  const [isDisplaySortList, setIsDisplaySortList] = useState(false)

  const [newModuleValue, setNewModuleValue] = useState('')

  const [filters, setFilters] = useState<FilterType>({
    rating_start: '',
    rating_end: '',
    list: []
  })
  const [isActiveFilter, setIsActiveFilter] = useState(false)

  const getModules = async (params?:FilterParams) => {
    const activeSortValue = sortList.filter((point)=>(point.isActive))[0]
    let filterParams
    if (isActiveFilter){
      filterParams = {
        teacher_ids: filters.list.map((point)=>point.id)[0], 
        rating_start: filters.rating_start && parseInt(filters.rating_start) ? parseInt(filters.rating_start) : -1,
        rating_end: filters.rating_end && parseInt(filters.rating_end) ? parseInt(filters.rating_end) : -1
      }
    }
    console.log(isActiveFilter, parseInt(filters.rating_start))
    try {
      const response = await axios.get<ModulesWithSubjects>(PagesURl.MODULE + '/subjects',{
        params: {
          institute_ids: getInstituteId(),
          sort: activeSortValue.backName,
          desc: activeSortValue.desc,
          ...filterParams,
          ...params
        }
      })
      setModules(response.data)
      console.log(response)
      getTeachers()
      getAddSubjectModules()
    } catch (error) {
      console.log(error)
    }
  }

  const getAddSubjectModules = async (addToList?: boolean, params?:FilterParams) => {
    try {
      const response = await axios.get<Modules>(PagesURl.MODULE, {
        params: {
          limit: LIST_LIMIT,
          ...params
        }
      })
      if (!addSubjectModules || !addToList){
        setAddSubjectModules(response.data)
      } else {
        setAddSubjectModules({
          ...response.data,
          content: [...addSubjectModules.content, ...response.data.content]
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const createModule = async () => {
    try {
      await axios.post(PagesURl.MODULE, {
        institute_id: getInstituteId(),
        name: newModuleValue
      })
      getModules()
    } catch (error) {
      console.log(error)
    }
  }
  const createSubject = async () => {
    try {
      await axios.post(PagesURl.SUBJECT, {
        name: addSubjectValues.name,
        module_id: modules?.content.filter((el)=>(el.name === addSubjectValues.module))[0].id
      })
      onResetAdd(setAddSubjectPopup)
      getModules()
    } catch (error) {
      console.log(error)
    }
  }
  const changeSearchValue = (newValue: string) => {
    setSearchValue(newValue)
    getModules({
      search: newValue,
      page: 1
    })
  }
  const getTeachers = async (addToList?: boolean, params?:FilterParams) => {
    try {
      const {data} = await axios.get<Teachers>(PagesURl.TEACHER + '/', {
        params: {
          institute_ids: getInstituteId(),
          limit: LIST_LIMIT,
          ...params
        }
      })
      console.log(data)
      data.content.forEach((teacher) => (
        getNameByAllNames(teacher)
      ))
      if (!addToList || !teachers){
        setTeachers(data)
      } else {
        setTeachers({
          ...data,
          content: [...teachers.content, ...data.content]
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeSortValue = (value: string) => {
    setSortList(updateRadioButtonList(value, sortList))
    setIsDisplaySortList(false) 
    getModules()
  }
  const changeSearchFilterValue = (value: string) => {
    getTeachers(false, value !== '' ? {search: value, page: 1} : {page: 1} )
    setSearchSubjectValue(value)
  }

  const onResetAdd = (func: (bool: boolean) => void) => {
    func(false)
    setNewModuleValue('')
    setAddSubjectValues({name: '', module: '', teachers: []})
  }

  const onChangePage = (isNext: boolean) => {
    if (!modules){
      return
    }
    getModules({
      page: modules.page_number + (isNext ? 1 : -1) 
    })
  }

  const resetFilters = () => {
    setFilters({
      rating_start: '',
      rating_end: '',
      list: []
    })
    setIsActiveFilter(false)
    setDisplayFilters(false)
    getModules({page: 1})
  }
  const submitFilters = () => {
    setIsActiveFilter(true)
    getModules({page: 1})
    setDisplayFilters(false)
  }

  useEffect(()=>{
    getModules()
  },[])

  useEffect(()=>{
    getModules()
  },[isActiveFilter])

  useEffect(()=>{
    getAddSubjectModules(false)
    getTeachers(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[addSubjectPopup])

  if (!modules || !teachers || !addSubjectModules) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>Модули</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.container__controlsBlock}>
          <h1 className={styles.container__title}>Модули</h1>
          <div className={styles.controls}>
            <div className={styles.controls__input}>
              <Input type='search' placeholder='Поиск...' value={searchValue} onChange={changeSearchValue} />
            </div>
            <SortBlock isOpenList={isDisplaySortList} changeIsOpenList={() => { setIsDisplaySortList(!isDisplaySortList) }} title='По алфавиту' icon='sort' type='radioButton' onChange={changeSortValue} list={sortList} />
            <div onClick={() => { setDisplayFilters(true); }} className={styles.controls__filters}>
              <Icon glyph='filter' glyphColor='grey' />
              <p className={styles.controls__text}>Фильтры</p>
            </div>
            <div className={styles.controls__block}>
              <div onClick={() => { setDisplaySettings(!displaySettings) }} className={`${styles.controls__filters} ${displaySettings ? styles.controls__filters_active : ''}`}>
                <Icon glyph='add' glyphColor={displaySettings ? 'white' : 'grey'} />
              </div>
              {displaySettings && <div className={styles.controls__list}>
                <div onClick={() => { setAddModulePopup(true); setDisplaySettings(false) }} className={styles.controls__point}>
                  <p>Добавить модуль</p>
                  <Icon glyph='arrow-right' glyphColor='grey' />
                </div>
                <div onClick={() => { setAddSubjectPopup(true); setDisplaySettings(false) }} className={styles.controls__point}>
                  <p>Добавить предмет</p>
                  <Icon glyph='arrow-right' glyphColor='grey' />
                </div>
              </div>}
            </div>
          </div>
        </div>
        <Table changePage={onChangePage} totalPages={modules.total_pages} currentPage={modules.page_number} isOpacity={isDisplaySortList || displaySettings} titles={['Модуль', 'Рейтинг']} data={modules.content} />
        <BottomLinks />
      </div>
      {displayFilters &&
        <Filter
          isSeeAll={teachers.content.length === teachers.total_record}
          onSeeAll={()=>{getTeachers(false, {limit: teachers.total_record})}}
          submitFilters={submitFilters}
          filter={filters} listName='Преподаватели'
          list={teachers.content.map((teacher)=>({id: teacher.id, name: teacher.name}))}
          searchValue={searchTeacherValue}
          changeSearchValue={changeSearchFilterValue}
          setDisplayFilters={setDisplayFilters}
          changeFilter={setFilters} 
          resetFilters={resetFilters}
        />
      }
      {addModulePopup &&
        <PopupContainer>
          <div className={subjectStyles.popup}>
            <h2 className={subjectStyles.popup__title}>Добавить модуль</h2>
            <Input placeholder='Название модуля' value={newModuleValue} onChange={setNewModuleValue} />
            <div className={subjectStyles.popup__buttons}>
              <Button onClick={() => { onResetAdd(setAddModulePopup)}} variant='whiteMain' size={'max'} >Отмена</Button>
              <Button onClick={()=>{createModule(); onResetAdd(setAddModulePopup)}} variant='primary' size={'max'} >Добавить</Button>
            </div>
          </div>
        </PopupContainer>
      }
      {addSubjectPopup &&
        <RightPopupContainer>
          <div className={subjectStyles.popup__content}>
            <h2 className={subjectStyles.popup__title}>Добавить предмет</h2>
            <div className={subjectStyles.popup__inputs}>
              <Input placeholder='Название предмета' value={addSubjectValues.name} onChange={(value)=>{setAddSubjectValues({...addSubjectValues, name: value})}} />
              <AddInput 
                onSearch={(searchValue)=>getAddSubjectModules(false, searchValue ? {page: 1, search: searchValue} : {page: 1})} 
                onSeeMore={(searchValue)=>{getAddSubjectModules(true, {page: addSubjectModules.page_number + 1, search: searchValue})}} 
                totalParts={addSubjectModules.total_pages} currentPart={addSubjectModules.page_number} 
                singleMode title='Выбрать модуль из списка' placeholder='Введите название модуля(не работает)' 
                selectedList={[addSubjectValues.module]} allList={addSubjectModules.content.map((module)=>module.name)} 
                changeInputList={(list)=>{setAddSubjectValues({...addSubjectValues, module: list[0]})}}
              />
              <AddInput 
                onSearch={(searchValue)=>getTeachers(false, searchValue ? {page: 1, search: searchValue} : {page: 1})} 
                onSeeMore={(searchValue)=>{getTeachers(true, {page: teachers.page_number + 1, search: searchValue})}} 
                currentPart={teachers.page_number} 
                totalParts={teachers.total_pages} 
                title='Выбрать преподавателя из списка(не заполнять)' placeholder='Введите ФИО преподавателя...' 
                selectedList={addSubjectValues.teachers} allList={teachers.content.map((teacher)=>(teacher.name))} 
                changeInputList={(list)=>{setAddSubjectValues({...addSubjectValues, teachers: list})}}
              />
            </div>
            <div className={subjectStyles.popup__buttons}>
              <Button size={'max'} onClick={() => { onResetAdd(setAddSubjectPopup)}} variant='whiteMain' >Отмена</Button>
              <Button size={'max'} onClick={createSubject}  variant='primary' >Добавить</Button>
            </div>
          </div>
        </RightPopupContainer>
      }
    </>
  )
}