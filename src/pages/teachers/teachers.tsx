import { Helmet } from 'react-helmet-async'
import styles from '../list.module.scss'
import teacherStyles from './teachers.module.scss'
import { useEffect, useState } from 'react'
import { updateRadioButtonList } from '../../utils/list'
import {AddInput, Input} from '../../components/input/Input'
import SortBlock from '../../components/sortBlock/sortBlock'
import { Icon } from '../../components/icon'
import Table from '../../components/table/table'
import Filter from '../../components/filter/filter'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { ALPHABET_LIST } from '../../consts/alphabetList'
import { Button } from '../../components/button/button'
import axios, { PagesURl } from '../../services/api';
import { Teachers } from '../../types/teacher'
import { FilterParams, FilterType } from '../../types/filter'
import { getInstituteId } from '../../services/institute'
import { Subjects } from '../../types/subject'
import { LIST_LIMIT } from '../../consts/limit'
import { getNameByAllNames } from '../../utils/teacher'

export default function TeachersPage() {

  const [teachers, setTeachers] = useState<Teachers>()

  const [searchValue, setSearchValue] = useState('')
  const [searchTeacherValue, setSearchTeacherValue] = useState('')
  const [sortList, setSortList] = useState(ALPHABET_LIST)
  const [subjects, setSubjects] = useState<Subjects>()

  const [isDisplaySortList, setIsDisplaySortList] = useState(false)

  const [displayFilters, setDisplayFilters] = useState(false)
  const [displayPopup, setDisplayPopup] = useState(false)

  const [newTeacherValue, setNewTeacherValue] = useState<{ name: string, email: string, password: string, subjects: string[] }>(
    { name: '', email: '', password: '', subjects: [] }
  )
  const [filters, setFilters] = useState<FilterType>({
    rating_start: '',
    rating_end: '',
    list: []
  })
  const [isActiveFilter, setIsActiveFilter] = useState(false)

  const getSubjects = async (addToList?: boolean, params?:FilterParams) => {
    try {
      const {data} = await axios.get<Subjects>(PagesURl.SUBJECT, {
        params: {
          institute_ids: getInstituteId(),
          limit: LIST_LIMIT,
          ...params
        }
      })
      if (!addToList || !subjects){
        setSubjects(data)
      } else {
        setSubjects({
          ...data,
          content: [...subjects.content, ...data.content]
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

/*   const addTeacher = () => {

  } */

  const getAllTeachers = async (params?:FilterParams) => {
    const activeSortValue = sortList.filter((point)=>(point.isActive))[0]
    let filterParams
    if (isActiveFilter){
      filterParams = {
        subject_ids: filters.list.map((point)=>point.id)[0], 
        rating_start: filters.rating_start && parseInt(filters.rating_start) ? parseInt(filters.rating_start) : -1,
        rating_end: filters.rating_end && parseInt(filters.rating_end) ? parseInt(filters.rating_end) : -1
      }
    }
    try {
      const {data, config} = await axios.get<Teachers>(PagesURl.TEACHER + '/', {
        params: {
          institute_ids: getInstituteId(),
          sort: activeSortValue.backName,
          desc: activeSortValue.desc,
          ...filterParams,
          ...params
        }
      })
      console.log(data, isActiveFilter, filterParams, config)
      data.content.forEach((teacher) => (
        getNameByAllNames(teacher)
      ))
      setTeachers(data)
      getSubjects()
    } catch (error) {
      console.log(error)
    }
  }

  const onChangePage = (isNext: boolean) => {
    if (!teachers){
      return
    }
    getAllTeachers({
      page: teachers.page_number + (isNext ? 1 : -1)
    })
  }

  const changeSearchValue = (newValue: string) => {
    setSearchValue(newValue)
    if (newValue !== '') {
      getAllTeachers({
        search: newValue,
        page: 1
      })
    } else {
      getAllTeachers({
        page: 1
      })
    }
  }

  const changeSortValue = (value: string) => {
    setSortList(updateRadioButtonList(value, sortList))
    setIsDisplaySortList(false)
    getAllTeachers()
  }
  const changeSearchFilterValue = (value: string) => {
    getSubjects(false, value !== '' ? {search: value, page: 1} : {page: 1} )
    setSearchTeacherValue(value)
  }

  const resetFilters = () => {
    setFilters({
      rating_start: '',
      rating_end: '',
      list: []
    })
    setIsActiveFilter(false)
    setDisplayFilters(false)
    getAllTeachers({page: 1})
  }
  const submitFilters = () => {
    setIsActiveFilter(true)
    getAllTeachers({page: 1})
    setDisplayFilters(false)
  }

  useEffect(()=>{
    getAllTeachers()
  },[])
  useEffect(()=>{
    getAllTeachers()
  },[isActiveFilter])

  if (!teachers || !subjects) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>Преподаватели</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.container__controlsBlock}>
          <h1 className={styles.container__title}>Преподаватели</h1>
          <div className={styles.controls}>
            <div className={styles.controls__input}>
              <Input type='search' placeholder='Поиск...' value={searchValue} onChange={changeSearchValue} />
            </div>
            <SortBlock isOpenList={isDisplaySortList} changeIsOpenList={() => { setIsDisplaySortList(!isDisplaySortList) }} title='По алфавиту' icon='sort' type='radioButton' onChange={changeSortValue} list={sortList} />
            <div onClick={() => { setDisplayFilters(true) }} className={styles.controls__filters}>
              <Icon glyph='filter' glyphColor='grey' />
              <p className={styles.controls__text}>Фильтры</p>
            </div>
            <div onClick={() => [setDisplayPopup(true)]} className={styles.controls__filters}>
              <Icon glyph='add' glyphColor='grey' />
            </div>
          </div>
        </div>
        <Table changePage={onChangePage} totalPages={teachers.total_pages} currentPage={teachers.page_number} isOpacity={isDisplaySortList} titles={['Фамилия Имя Отчество', 'Рейтинг']} data={teachers.content}/>
        <BottomLinks />
      </div>
      {displayPopup &&
        <div className={teacherStyles.popup}>
          <div className={teacherStyles.popup__content}>
            <h2 className={teacherStyles.popup__title}>Добавить преподавателя(не работает)</h2>
            <Input placeholder='Фамилия Имя Отчество' value={newTeacherValue.name} onChange={(value) => { setNewTeacherValue({ ...newTeacherValue, name: value }) }} />
            <Input placeholder='Почта' value={newTeacherValue.email} onChange={(value) => { setNewTeacherValue({ ...newTeacherValue, email: value }) }} />
            <Input placeholder='Разовый пароль...' value={newTeacherValue.password} onChange={(value) => { setNewTeacherValue({ ...newTeacherValue, password: value }) }} />
            <AddInput onSearch={()=>{}} onSeeMore={()=>{}} totalParts={1} currentPart={1} title='Добавить предметы' placeholder='Введите название предмета' allList={['Предмет1', 'Предмет2', 'Предмет3']} selectedList={newTeacherValue.subjects} changeInputList={(newList) => { setNewTeacherValue({ ...newTeacherValue, subjects: newList }) }} />
            <Button variant='primary' style={{ width: '100%' }}>Отправить пригласительное письмо</Button>
            <Button
              onClick={() => { setDisplayPopup(false); setNewTeacherValue({ name: '', email: '', password: '', subjects: [] }) }}
              variant='whiteMain' style={{ width: '100%' }}>
              Отмена
            </Button>
          </div>
        </div>
      }
      {displayFilters &&
        <Filter
          submitFilters={submitFilters}
          onSeeAll={()=>{getSubjects(false, {limit: subjects.total_record})}}
          isSeeAll={subjects.total_record === subjects.content.length}
          filter={filters} listName='Предметы'
          list={subjects.content.map((subject)=>({name: subject.name, id: subject.id}))}
          searchValue={searchTeacherValue}
          changeSearchValue={changeSearchFilterValue}
          setDisplayFilters={setDisplayFilters}
          changeFilter={setFilters} 
          resetFilters={resetFilters}/>
      }
    </>
  )
}