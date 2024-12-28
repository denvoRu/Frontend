import { FilterType } from '../../types/filter'
import { removeElementAtIndex } from '../../utils'
import { Button } from '../button/button'
import { Input } from '../input/Input'
import RightPopupContainer from '../rightPopupContainer/rightPopupContainer'
import styles from './filter.module.scss'

type FilterProps = {
  filter: FilterType
  list: {id: string, name: string}[]
  listName: string
  changeFilter: (newFilter: FilterType) => void
  setDisplayFilters: (value: boolean) => void
  resetFilters: ()=>void
  submitFilters: ()=>void
  searchValue: string
  changeSearchValue: (newValue: string) => void
  onSeeAll: ()=>void
  isSeeAll:boolean
}

export default function Filter({ filter, listName, searchValue, list, changeSearchValue, changeFilter, setDisplayFilters, onSeeAll, resetFilters, submitFilters, isSeeAll }: FilterProps) {

  const changeTeachersList = (point: {name: string, id: string}) => {
    const newFilters = { ...filter }
    const index = newFilters.list.findIndex(item => item.id === point.id && item.name === point.name);
    console.log(index, filter)
    if (index !== -1) {
      newFilters.list = removeElementAtIndex(newFilters.list, index)
      changeFilter(newFilters)
      return
    }
    newFilters.list.push(point)
    changeFilter(newFilters)
  }

  const isListIncludesPoint = (point: {name: string, id: string}) => {
    const index = filter.list.findIndex(item => item.id === point.id && item.name === point.name);
    return index !== -1
  }

  return (
    <RightPopupContainer>
      <>
        <div className={styles.filters__firstLine}>
          <h2 className={styles.filters__title}>Фильтры</h2>
          <img className={styles.filters__close} onClick={() => { setDisplayFilters(false) }} src='/icons/close.svg' />
        </div>
        <h3 className={styles.filters__subTitle}>Рейтинг</h3>
        <div className={styles.filters__inputs}>
          <Input placeholder='От' value={filter.rating_start} onChange={(value) => changeFilter({ ...filter, rating_start: value })} />
          <Input placeholder='До' value={filter.rating_end} onChange={(value) => changeFilter({ ...filter, rating_end: value })} />
        </div>
        <h3 className={styles.filters__subTitle}>{listName}</h3>
        <Input placeholder='Поиск' value={searchValue} onChange={changeSearchValue} />
        <div className={styles.filters__teachers}>
          {list.map((point) => (
            <div key={point.id} onClick={() => { changeTeachersList(point) }} className={styles.filters__teacher}>
              <img src={`/icons/checkbox/${isListIncludesPoint(point) ? 'active' : 'disable'}.svg`} />
              <p>{point.name}</p>
            </div>
          ))}
        </div>
        {isSeeAll || <p onClick={onSeeAll} className={styles.filters__showMore}>Посмотреть все</p>}
        <div className={styles.filters__buttons}>
          <Button onClick={submitFilters} variant='primary' style={{ width: '100%' }}>Применить</Button>
          <Button onClick={resetFilters} variant='whiteMain' style={{ width: '100%' }}>Сбросить все</Button>
        </div>
      </>
    </RightPopupContainer>
  )
}