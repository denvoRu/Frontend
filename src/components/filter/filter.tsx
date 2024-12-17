import { FilterType } from '../../types/filter'
import { removeElementAtIndex } from '../../utils'
import { Button } from '../button/button'
import { Input } from '../input/Input'
import RightPopupContainer from '../rightPopupContainer/rightPopupContainer'
import styles from './filter.module.scss'

type FilterProps = {
  filter: FilterType
  list: string[]
  listName: string
  changeFilter: (newFilter: FilterType) => void
  setDisplayFilters: (value: boolean) => void
  searchValue: string
  changeSearchValue: (newValue: string) => void
}

export default function Filter({ filter, listName, searchValue, list, changeSearchValue, changeFilter, setDisplayFilters }: FilterProps) {

  const changeTeachersList = (point: string) => {
    const newFilters = { ...filter }
    if (filter.list.includes(point)) {
      newFilters.list = removeElementAtIndex(newFilters.list, newFilters.list.indexOf(point))
      changeFilter(newFilters)
      return
    }
    newFilters.list.push(point)
    changeFilter(newFilters)
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
          <Input placeholder='От' value={filter.from} onChange={(value) => changeFilter({ ...filter, from: value })} />
          <Input placeholder='До' value={filter.to} onChange={(value) => changeFilter({ ...filter, to: value })} />
        </div>
        <h3 className={styles.filters__subTitle}>{listName}</h3>
        <Input placeholder='Поиск' value={searchValue} onChange={changeSearchValue} />
        <div className={styles.filters__teachers}>
          {list.map((point) => (
            <div onClick={() => { changeTeachersList(point) }} className={styles.filters__teacher}>
              <img src={`/icons/checkbox/${filter.list.includes(point) ? 'active' : 'disable'}.svg`} />
              <p>{point}</p>
            </div>
          ))}
        </div>
        <p className={styles.filters__showMore}>Посмотреть все</p>
        <div className={styles.filters__buttons}>
          <Button variant='primary' style={{ width: '100%' }}>Применить</Button>
          <Button variant='whiteMain' style={{ width: '100%' }}>Сбросить все</Button>
        </div>
      </>
    </RightPopupContainer>
  )
}