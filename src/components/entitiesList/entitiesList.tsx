import { useState } from 'react'
import { TableEntity } from '../../types/tableEntity'
import GreyBlockContainer from '../greyBlockContainer/greyBlockContainer'
import { Icon } from '../icon'
import { glyphs } from '../icon/icon-props'
import styles from './entitiesList.module.scss'
import { removeElementAtIndex } from '../../utils'

type TableItem = {
  name: string, 
  id: string
}

type EntitiesListProps = {
  displayOpacity?: boolean
  icon: glyphs
  title: string
  subtitle: string
  list: TableEntity[]
  addList?: TableItem[]
  changeSearchValue: (value: string) => void
  onNavigateSchedule?: (lessonId: string) => void
  showMore: (nextPage: number) => void
  deleteItem: (id: string) => void
  onConfirmChanges?: (selectedIds: string[]) => void
  totalPages: number
}

export default function EntitiesList (props:EntitiesListProps) {

  const [isDisplayAdd, setIsDisplayAdd] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedList, setSelectedList] = useState<TableItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const changeIsDisplayAdd = () => {
    setIsDisplayAdd(!isDisplayAdd)
  }

  const changeSearchValue = (value: string) => {
    setSearchValue(value)
    props.changeSearchValue(value)
  }

  const changeSelectedList = (item: TableItem) => {
    let newSelectedList = selectedList.slice()
    const index = newSelectedList.findIndex(point => point.id === item.id && point.name === point.name)
    if (index !== -1) {
      newSelectedList = removeElementAtIndex(newSelectedList, index)
    } else {
      newSelectedList.push(item)
    }
    setSelectedList(newSelectedList)
  }

  const isSelectedListIncludesValue = (item: TableItem) => {
    return selectedList.findIndex(point => point.id === item.id && point.name === point.name) !== -1
  }

  const onConfirmChanges = () => {
    setIsDisplayAdd(false)
    if (selectedList.length !== 0 && props.onConfirmChanges) {
      props.onConfirmChanges(selectedList.map((value)=>value.id))
    }
    setSelectedList([])
  }

  const onShowMore = () => {
    props.showMore(currentPage + 1)
    setCurrentPage(currentPage + 1)
  }

  return (
    <GreyBlockContainer displayOpacity={props.displayOpacity}>
      <div>
        <div className={styles.titleLine}>
          <Icon glyph={props.icon}/>
          <h3 className={styles.title}>{props.title}</h3>
        </div>
        {props.onConfirmChanges && props.addList &&  !(props.addList.length==0 && searchValue==='') && <div onClick={changeIsDisplayAdd} className={styles.switch}>
          <h3 className={`${styles.switch__title} ${isDisplayAdd && styles.switch__title_active}`}>{props.subtitle}</h3>
          <Icon glyph={`arrow-${isDisplayAdd ? 'up' : 'down'}`} glyphColor={`${isDisplayAdd ? 'grey' : 'light-grey'}`}/>
        </div>}
        <div className={styles.table}>
          {!isDisplayAdd ? props.list.map((item) => (
            <div onClick={props.onNavigateSchedule && (() => props.onNavigateSchedule!(item.id))} key={item.id} className={styles.table__line}>
              <p className={`${styles.table__name} ${props.addList && styles.table__name_trash}`}>{item.name}</p>
              <p className={`${styles.table__rating} ${props.addList && styles.table__rating_trash}`}>
                <span className={styles.table__rating_mobileHide}>Рейтинг:&nbsp;</span>
                {item.rating}
              </p>
              {props.addList && <Icon onClick={(e)=>{e.stopPropagation();props.deleteItem(item.id)}} className={styles.table__delete} glyph='trash' glyphColor='grey'/>}
            </div>
          )) :
            <>
              <div className={styles.table__addline}>
                <Icon glyph='search' glyphColor='grey' />
                <input value={searchValue} onChange={(e) => { changeSearchValue(e.target.value) }} placeholder={`Поиск`} className={styles.table__search} />
                {searchValue!=='' && <img onClick={()=>{changeSearchValue('')}} className={styles.table__clear} src='/icons/close.svg'/>}
              </div>
              {props.addList && props.addList.map((item) => (
                <div onClick={()=>{changeSelectedList(item)}} key={item.id} className={styles.table__addline}>
                  <img className={styles.table__checkbox} src={`/icons/checkbox/${isSelectedListIncludesValue(item) ? 'active' : 'disable'}.svg`}/>
                  <p className={styles.table__name_onAdd}>{item.name}</p>
                </div>
              ))}
            </>}
          {!isDisplayAdd && props.totalPages !== currentPage && props.list.length!==0 && <p onClick={onShowMore} className={styles.table__showMore}>Посмотреть ещё</p>}
          {isDisplayAdd && <p onClick={onConfirmChanges} className={styles.table__showMore}>Сохранить изменения</p>}
        </div>
      </div>
    </GreyBlockContainer>
  )
}