import { Helmet } from 'react-helmet-async'
import styles from '../list.module.scss'
import subjectStyles from './subjects.module.scss'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import Input from '../../components/input/Input'
import { useState } from 'react'
import SortBlock from '../../components/sortBlock/sortBlock'
import { ALPHABET_LIST } from '../../consts/alphabetList'
import { updateRadioButtonList } from '../../utils/list'
import { Icon } from '../../components/icon'
import { Button } from '../../components/button/button'
import PopupContainer from '../../components/popupContainer/popupContainer'
import Table from '../../components/table/table'
import { SUBJECTS } from '../../mocks/subjects'
import Filter from '../../components/filter/filter'

export default function Subjects() {

  const [searchValue, setSearchValue] = useState('')
  const [searchTeacherValue, setSearchSubjectValue] = useState('')
  const [sortList, setSortList] = useState(ALPHABET_LIST)
  const [teachers, setTeachers] = useState(['1Фамилия Имя Отчество', '2Фамилия Имя Отчество', '3Фамилия Имя Отчество'])

  const [displayFilters, setDisplayFilters] = useState(false)
  const [displayPopup, setDisplayPopup] = useState(false)

  const [isDisplaySortList, setIsDisplaySortList] = useState(false)

  const [newSubjectValue, setNewSubjectValue] = useState('')

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
        <Table isOpacity={isDisplaySortList} titles={['Предмет', 'Рейтинг']} data={SUBJECTS} tableFrom='subjects' />
        <BottomLinks />
      </div>
      {
        displayPopup &&
        <PopupContainer>
          <div className={subjectStyles.popup}>
            <h2 className={subjectStyles.popup__title}>Добавить предмет</h2>
            <Input placeholder='Название предмета' value={newSubjectValue} onChange={setNewSubjectValue} />
            <div className={subjectStyles.popup__buttons}>
              <Button onClick={() => { setDisplayPopup(false); setNewSubjectValue('') }} variant='whiteMain' style={{ width: '100%' }}>Отмена</Button>
              <Button variant='primary' style={{ width: '100%' }}>Добавить</Button>
            </div>
          </div>
        </PopupContainer>
      }
      {displayFilters &&
        <Filter
          filter={filters} listName='Преподаватели'
          list={teachers}
          searchValue={searchTeacherValue}
          changeSearchValue={setSearchSubjectValue}
          setDisplayFilters={setDisplayFilters}
          changeFilter={setFilters} />
      }
    </>
  )
}