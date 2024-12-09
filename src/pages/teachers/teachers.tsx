import { Helmet } from 'react-helmet-async'
import styles from '../list.module.scss'
import teacherStyles from './teachers.module.scss'
import { useState } from 'react'
import { updateRadioButtonList } from '../../utils/list'
import Input from '../../components/input/Input'
import SortBlock from '../../components/sortBlock/sortBlock'
import { Icon } from '../../components/icon'
import Table from '../../components/table/table'
import { TEACHERS } from '../../mocks/teachers'
import Filter from '../../components/filter/filter'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { ALPHABET_LIST } from '../../consts/alphabetList'
import { Button } from '../../components/button/button'

export default function Teachers () {

  const [searchValue, setSearchValue] = useState('')
  const [searchTeacherValue, setSearchTeacherValue] = useState('')
  const [sortList, setSortList] = useState(ALPHABET_LIST)
  const [subjects, setSubjects] = useState(['1Предмет','2Предмет', '3Предмет'])

  const [displayFilters, setDisplayFilters] = useState(false)
  const [displayPopup, setDisplayPopup] = useState(false)

  const [newTeacherValue, setNewTeacherValue] = useState<{name: string, email: string, password: string, subjects: string[]}>(
    {name: '', email: '', password: '', subjects: []}
  )

  const [filters, setFilters] = useState<{from: string, to: string, list: string[]}>({
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

  return (
    <>
      <Helmet>
        <title>Предметы</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.container__controlsBlock}>
          <h1 className={styles.container__title}>Предметы</h1>
          <div className={styles.controls}>
            <div className={styles.controls__input}>
              <Input placeholder='Поиск...' value={searchValue} onChange={changeSearchValue}/>
            </div>
            <SortBlock title='По алфавиту' icon='sort' type='radioButton' onChange={changeSortValue} list={sortList}/>
            <div onClick={()=>{setDisplayFilters(true)}} className={styles.controls__filters}>
              <Icon glyph='filter' glyphColor='grey'/>
              <p className={styles.controls__text}>Фильтры</p>
            </div>
            <div onClick={()=>[setDisplayPopup(true)]} className={styles.controls__filters}>
              <Icon glyph='add' glyphColor='grey'/>
            </div>
          </div>
        </div>
        <Table titles={['Фамилия Имя Отчество', 'Рейтинг']} data={TEACHERS}/>
        {displayFilters &&
        <Filter 
          filter={filters} listName='Предметы' 
          list={subjects}
          searchValue={searchTeacherValue} 
          changeSearchValue={setSearchTeacherValue}
          setDisplayFilters={setDisplayFilters}
          changeFilter={setFilters}/>
        }
        {displayPopup && 
          <div className={teacherStyles.popup}>
            <div className={teacherStyles.popup__content}>
              <h2 className={teacherStyles.popup__title}>Добавить преподавателя</h2>
              <Input placeholder='Фамилия Имя Отчество' value={newTeacherValue.name} onChange={(value)=>{setNewTeacherValue({...newTeacherValue, name: value})}}/>
              <Input placeholder='Почта' value={newTeacherValue.email} onChange={(value)=>{setNewTeacherValue({...newTeacherValue, email: value})}}/>
              <Input placeholder='Разовый пароль...' value={newTeacherValue.password} onChange={(value)=>{setNewTeacherValue({...newTeacherValue, password: value})}}/>
              <AddSubjectInput changeSubjectList={(newList)=>{setNewTeacherValue({...newTeacherValue, subjects: newList})}}/>
              <Button variant='primary' style={{width: '100%'}}>Отправить пригласительное письмо</Button>
              <Button 
                onClick={()=>{setDisplayPopup(false);setNewTeacherValue({name: '', email: '', password: '', subjects: []})}} 
                variant='whiteMain' style={{width: '100%'}}>
                Отмена
              </Button>
            </div>
          </div>
          }
        <BottomLinks/>
      </div>
    </>
  )
}

type AddSubjectInputProps = {
  changeSubjectList: (newList: string[]) => void
}

function AddSubjectInput ({changeSubjectList}:AddSubjectInputProps) {

  const [searchValue, setSearchValue] = useState('')
  const [displayList, setDisplayList] = useState(false)

  return (
    <div className={teacherStyles.subjectList}>

    </div>
  )
}