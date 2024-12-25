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
import { FilterParams } from '../../types/filter'

export default function TeachersPage() {

  const [teachers, setTeachers] = useState<Teachers>()

  const [searchValue, setSearchValue] = useState('')
  const [searchTeacherValue, setSearchTeacherValue] = useState('')
  const [sortList, setSortList] = useState(ALPHABET_LIST)
  const [subjects,] = useState(['1Предмет', '2Предмет', '3Предмет'])

  const [isDisplaySortList, setIsDisplaySortList] = useState(false)

  const [displayFilters, setDisplayFilters] = useState(false)
  const [displayPopup, setDisplayPopup] = useState(false)

  const [newTeacherValue, setNewTeacherValue] = useState<{ name: string, email: string, password: string, subjects: string[] }>(
    { name: '', email: '', password: '', subjects: [] }
  )
  const [filters, setFilters] = useState<{ from: string, to: string, list: string[] }>({
    from: '',
    to: '',
    list: []
  })

  const changeSearchValue = (newValue: string) => {
    setSearchValue(newValue)
  }

  const changeSortValue = (value: string) => {
    setSortList(updateRadioButtonList(value, sortList))
  }

/*   const addTeacher = () => {

  } */

  const getAllTeachers = async (params?:FilterParams) => {
    try {
      const {data} = await axios.get<Teachers>(PagesURl.TEACHER + '/', {
        params: params
      })
      setTeachers(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getAllTeachers()
  },[])

  if (!teachers) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>Преподаватели</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.container__controlsBlock}>
          <h1 className={styles.container__title}>Преподаватели(В разработке)</h1>
          <div className={styles.controls}>
            <div className={styles.controls__input}>
              <Input placeholder='Поиск...' value={searchValue} onChange={changeSearchValue} />
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
        <Table isOpacity={isDisplaySortList} titles={['Фамилия Имя Отчество', 'Рейтинг']} data={teachers.content}/>
        <BottomLinks />
      </div>
      {displayPopup &&
        <div className={teacherStyles.popup}>
          <div className={teacherStyles.popup__content}>
            <h2 className={teacherStyles.popup__title}>Добавить преподавателя</h2>
            <Input placeholder='Фамилия Имя Отчество' value={newTeacherValue.name} onChange={(value) => { setNewTeacherValue({ ...newTeacherValue, name: value }) }} />
            <Input placeholder='Почта' value={newTeacherValue.email} onChange={(value) => { setNewTeacherValue({ ...newTeacherValue, email: value }) }} />
            <Input placeholder='Разовый пароль...' value={newTeacherValue.password} onChange={(value) => { setNewTeacherValue({ ...newTeacherValue, password: value }) }} />
            <AddInput title='Добавить предметы' placeholder='Введите название предмета' allList={['Предмет1', 'Предмет2', 'Предмет3']} selectedList={newTeacherValue.subjects} changeInputList={(newList) => { setNewTeacherValue({ ...newTeacherValue, subjects: newList }) }} />
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
          filter={filters} listName='Предметы'
          list={subjects}
          searchValue={searchTeacherValue}
          changeSearchValue={setSearchTeacherValue}
          setDisplayFilters={setDisplayFilters}
          changeFilter={setFilters} />
      }
    </>
  )
}