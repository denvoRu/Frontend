import { useEffect, useState } from 'react'
import styles from './sortBlock.module.scss'
import { Icon } from '../icon'
import { glyphs } from '../icon/icon-props'

type SortBlockProps = {
  title: string
  icon: glyphs
  list: {value: string, isActive: boolean}[]
  onChange: (value: string) => void
  type: 'radioButton' | 'checkbox'
  isOpenList?: boolean
  titlePadding?:number
  changeIsOpenList?: () => void
}

export default function SortBlock ({title, icon, list, type, isOpenList, titlePadding, onChange, changeIsOpenList}:SortBlockProps) {

  const [isOpen, setIsOpen] = useState(isOpenList !== undefined ? isOpenList : false)

  const changeOpenList = () => {
    if (changeIsOpenList){
      changeIsOpenList()
    }
    setIsOpen(!isOpen)
  }

  useEffect(()=>{
    if (isOpenList !== undefined) {
      setIsOpen(isOpenList)
    }
  },[isOpenList])

  return (
    <div className={styles.container}>
      <div style={titlePadding ? {padding: `12px ${titlePadding}px` } : {}} onClick={changeOpenList} className={`${styles.container__titleBlock} ${isOpen ? styles.container__titleBlock_active : ''}`}>
        <Icon glyph={icon} glyphColor={isOpen ? 'white' : 'grey'}/>
        <p className={`${styles.container__title} ${isOpen ? styles.container__title_active : ''}`}>{type==='radioButton' ? list.filter((point)=>point.isActive)[0]?.value : title}</p>
      </div>
      {isOpen && 
        <div className={styles.container__list}>
          {list.map((el)=>(
            <div key={el.value} onClick={()=>{onChange(el.value)}} className={styles.container__point}>
              {type === 'radioButton' ?
              <img src={`/icons/radioButton/${el.isActive ? 'active' : 'disable'}.svg`}/> : 
              <img src={`/icons/checkbox/${el.isActive ? 'active' : 'disable'}.svg`}/>}
              <p className={styles.container__value}>{el.value}</p>
            </div>
          ))}
        </div>
      }
    </div>
  )
}