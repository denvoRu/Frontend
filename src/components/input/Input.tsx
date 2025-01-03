import { useEffect, useRef, useState } from 'react'
import styles from './input.module.scss'
import { removeElementAtIndex } from '../../utils'
import { Icon } from '../icon'

type InputProps = {
  placeholder?: string
  required?: boolean
  type?: 'email' | 'password' | 'search'
  value: string
  onChange: (value: string) => void
}

export function Input ({placeholder, value, required, type, onChange}:InputProps) {


  const textarea = useRef<HTMLTextAreaElement>(null)
  const [rows, setRows] = useState(1);

  const changeTextarea = (value: string) => {
    onChange(value)
    if (textarea.current) {
      const lineHeight = parseInt(window.getComputedStyle(textarea.current).lineHeight, 10);
      const newRows = Math.ceil(textarea.current.scrollHeight / lineHeight) - 1;
      setRows(newRows);
    }
  }

  useEffect(() => { 
    if (textarea.current) {
      if (textarea.current) {
        const lineHeight = parseInt(window.getComputedStyle(textarea.current).lineHeight, 10);
        const newRows = Math.ceil(textarea.current.scrollHeight / lineHeight) - 1;
        setRows(newRows);
      }
    }
}, [textarea]);

  return (
    <div className={styles.inputBlock}>
      {type ? <input type={type} required={required} className={styles.input} placeholder={placeholder} value={value} onChange={(e)=>{onChange(e.target.value)}}/> :
    <textarea ref={textarea} rows={rows} className={styles.input} placeholder={placeholder} value={value} onChange={(e)=>{changeTextarea(e.target.value)}}/>}
    {type === 'search' && value!=='' && <img onClick={()=>{onChange('')}} className={styles.input__clear} src='/icons/close.svg'/>}
    </div>
  )
}

type AddInputProps = {
  changeInputList: (newList: string[]) => void
  onSeeMore: (searchValue?:string) => void
  onSearch: (searchValue?:string) => void
  selectedList: string[]
  allList: string[]
  title: string
  placeholder: string
  singleMode?:boolean
  totalParts: number
  currentPart: number
}


export function AddInput({ selectedList, changeInputList, allList, title, placeholder, singleMode, totalParts, currentPart, onSeeMore, onSearch }: AddInputProps) {

  const [searchValue, setSearchValue] = useState('')
  const [displayList, setDisplayList] = useState(false)

  const changeSearchValue = (newvalue: string) => {
    setSearchValue(newvalue)
    onSearch(newvalue!=='' ? newvalue : undefined)
  }


  const changeList = (value: string) => {
    let newList = selectedList.slice()
    if (selectedList.includes(value)) {
      newList = removeElementAtIndex(newList, newList.indexOf(value))
      changeInputList(newList)
      return
    }
    if (singleMode) {
      newList = [value]
    } else {
      newList.push(value)
    }
    changeInputList(newList)
  }

  const seeMore = () => {
    onSeeMore(searchValue!=='' ? searchValue : undefined)
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
            <img src={`/icons/${singleMode ? 'radioButton': 'checkbox'}/${selectedList.includes(el) ? 'active' : 'disable'}.svg`} />
            <p>{el}</p>
          </div>
        ))}
        {totalParts !== currentPart && <p onClick={seeMore} className={styles.list__showMore}>Показать еще...</p>}
      </div>}
    </div>
  )
}