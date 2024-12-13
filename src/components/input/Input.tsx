import { useState } from 'react'
import styles from './input.module.scss'
import { removeElementAtIndex } from '../../utils'
import { Icon } from '../icon'

type InputProps = {
  placeholder?: string
  required?: boolean
  type?: 'email' | 'password'
  value: string
  onChange: (value: string) => void
}

export function Input ({placeholder, value, required, type, onChange}:InputProps) {
  return (
    <input type={type} required={required} className={styles.input} placeholder={placeholder} value={value} onChange={(e)=>{onChange(e.target.value)}}/>
  )
}

type AddInputProps = {
  changeInputList: (newList: string[]) => void
  selectedList: string[]
  allList: string[]
  title: string
  placeholder: string
}


export function AddInput({ selectedList, changeInputList, allList, title, placeholder }: AddInputProps) {

  const [searchValue, setSearchValue] = useState('')
  const [displayList, setDisplayList] = useState(false)

  const changeSearchValue = (newvalue: string) => {
    setSearchValue(newvalue)
  }


  const changeList = (value: string) => {
    let newList = selectedList.slice()
    if (selectedList.includes(value)) {
      newList = removeElementAtIndex(newList, newList.indexOf(value))
      changeInputList(newList)
      return
    }
    newList.push(value)
    changeInputList(newList)
  }

  return (
    <div className={styles.list}>
      <div onClick={() => { setDisplayList(!displayList) }} className={`${styles.list__title} ${displayList ? styles.list__title_active : ''}`}>
        <p>{title}</p>
        <Icon glyph='arrow-down' glyphColor={displayList ? 'white' : 'grey'} />
      </div>
      {displayList && <div className={styles.list__list}>
        <div className={styles.list__line}>
          <Icon glyph='search' glyphColor='grey' />
          <input value={searchValue} onChange={(e) => { changeSearchValue(e.target.value) }} placeholder={`${placeholder}...`} className={styles.list__search} />
        </div>
        {allList.map((el) => (
          <div key={el} onClick={() => { changeList(el) }} className={styles.list__line}>
            <img src={`/icons/checkbox/${selectedList.includes(el) ? 'active' : 'disable'}.svg`} />
            <p>{el}</p>
          </div>
        ))}
        <p className={styles.list__showMore}>Показать еще...</p>
      </div>}
    </div>
  )
}