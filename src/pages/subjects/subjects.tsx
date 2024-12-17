import { Helmet } from 'react-helmet-async'
import styles from '../list.module.scss'
import subjectStyles from './subjects.module.scss'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { AddInput, Input } from '../../components/input/Input'
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
import RightPopupContainer from '../../components/rightPopupContainer/rightPopupContainer'

export default function Subjects() {

  const [searchValue, setSearchValue] = useState('')
  const [searchTeacherValue, setSearchSubjectValue] = useState('')
  const [sortList, setSortList] = useState(ALPHABET_LIST)
  const [teachers,] = useState(['1Фамилия Имя Отчество', '2Фамилия Имя Отчество', '3Фамилия Имя Отчество'])
  const [modules,] = useState(SUBJECTS.map(item => item.name))

  const [displaySettings, setDisplaySettings] = useState(false)
  const [addModulePopup, setAddModulePopup] = useState(false)
  const [addSubjectPopup, setAddSubjectPopup] = useState(false)

  const [addSubjectValues, setAddSubjectValues] = useState<{name: string, module: string, teachers: string[]}>({name: '', module: '', teachers: []})

  const [displayFilters, setDisplayFilters] = useState(false)

  const [isDisplaySortList, setIsDisplaySortList] = useState(false)

  const [newModuleValue, setNewModuleValue] = useState('')

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

  const onResetAdd = (func: (bool: boolean) => void) => {
    func(false)
    setNewModuleValue('')
    setAddSubjectValues({name: '', module: '', teachers: []})
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
              <Input placeholder='Поиск...' value={searchValue} onChange={changeSearchValue} />
            </div>
            <SortBlock isOpenList={isDisplaySortList} changeIsOpenList={() => { setIsDisplaySortList(!isDisplaySortList) }} title='По алфавиту' icon='sort' type='radioButton' onChange={changeSortValue} list={sortList} />
            <div onClick={() => { setDisplayFilters(true) }} className={styles.controls__filters}>
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
        <Table isOpacity={isDisplaySortList || displaySettings} titles={['Предмет', 'Рейтинг']} data={SUBJECTS} />
        <BottomLinks />
      </div>
      {displayFilters &&
        <Filter
          filter={filters} listName='Преподаватели'
          list={teachers}
          searchValue={searchTeacherValue}
          changeSearchValue={setSearchSubjectValue}
          setDisplayFilters={setDisplayFilters}
          changeFilter={setFilters} />
      }
      {addModulePopup &&
        <PopupContainer>
          <div className={subjectStyles.popup}>
            <h2 className={subjectStyles.popup__title}>Добавить модуль</h2>
            <Input placeholder='Название модуля' value={newModuleValue} onChange={setNewModuleValue} />
            <div className={subjectStyles.popup__buttons}>
              <Button onClick={() => { onResetAdd(setAddModulePopup)}} variant='whiteMain' size={'max'} >Отмена</Button>
              <Button variant='primary' size={'max'} >Добавить</Button>
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
              <AddInput singleMode title='Выбрать модуль из списка' placeholder='Введите название модуля' selectedList={[addSubjectValues.module]} allList={modules} changeInputList={(list)=>{setAddSubjectValues({...addSubjectValues, module: list[0]})}}/>
              <AddInput title='Выбрать преподавателя из списка' placeholder='Введите ФИО преподавателя...' selectedList={addSubjectValues.teachers} allList={teachers} changeInputList={(list)=>{setAddSubjectValues({...addSubjectValues, teachers: list})}}/>
            </div>
            <div className={subjectStyles.popup__buttons}>
              <Button size={'max'} onClick={() => { onResetAdd(setAddSubjectPopup)}} variant='whiteMain' >Отмена</Button>
              <Button size={'max'}  variant='primary' >Добавить</Button>
            </div>
          </div>
        </RightPopupContainer>
      }
    </>
  )
}