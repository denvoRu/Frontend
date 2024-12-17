import { Helmet } from 'react-helmet-async'
import styles from './main.module.scss'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useState } from 'react'
import { RAITING_LIST } from '../../consts/raitingList'
import { updateRadioButtonList } from '../../utils/list'
import { INSTITUTES_LIST } from '../../mocks/institutes'
import { Link } from 'react-router-dom'
import { Button } from '../../components/button/button'
import PopupContainer from '../../components/popupContainer/popupContainer'
import { Input } from '../../components/input/Input'

export default function Main() {

  const [sortList, setSortList] = useState(RAITING_LIST)
  const [isOpenList, setIsOpenList] = useState(false)

  const [statistics, ] = useState(INSTITUTES_LIST)

  const [displayAddInstitute, setDisplayAddInstitute] = useState(false)
  
  const [newInstitute, setNewInstitute] = useState({name: '', shortName: '', address: ''})

  const onChangeSortList = (value: string) => {
    setSortList(updateRadioButtonList(value, sortList))
    setIsOpenList(false)
  }

  return (
    <>
      <Helmet>
        <title>Главная</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.container__firstLine}>
          <div className={styles.container__titleBlock}>
            <Icon glyph='rating' size={42} />
            <h1 className={styles.container__title}>Рейтинг Университета</h1>
          </div>
          <div className={styles.statistics__block}>
            <Button onClick={()=>{setDisplayAddInstitute(true)}} variant={'whiteMain'}>
              <Icon glyph='add' glyphColor='grey'/>
              <span className={styles.container__button}>Добавить</span>
            </Button>
            <SortBlock
              title='По рейтингу' icon='sort' list={sortList} type='radioButton'
              onChange={onChangeSortList}
              isOpenList={isOpenList}
              changeIsOpenList={() => setIsOpenList(!isOpenList)}
            />
          </div>
        </div>
        <div className={styles.statisticsBlock}>
          <div className={styles.statistics}>
            {statistics.map((statistic) => (
              <Link to='/institutes/2' className={`${styles.statistics__point} ${isOpenList ? 'opacity' : ''}`} key={statistic.name} style={{ width: `${statistic.percent}%` }}>
                <p>{statistic.name}</p>
                <div className={styles.statistics__block}>
                  <p>{statistic.percent}</p>
                  <Icon glyph='arrow-right'  glyphColor='white'/>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {displayAddInstitute && 
        <PopupContainer>
          <div className={styles.popup}>
            <h1 className={styles.popup__title}>Добавить институт</h1>
            <Input 
              placeholder='Введите полное название институа' 
              value={newInstitute.name} 
              onChange={(value)=>setNewInstitute({...newInstitute, name: value})}
            />
            <Input 
              placeholder='Введите короткое название института' 
              value={newInstitute.shortName} 
              onChange={(value)=>setNewInstitute({...newInstitute, shortName: value})}
            />
            <Input 
              placeholder='Введите адрес института' 
              value={newInstitute.address} 
              onChange={(value)=>setNewInstitute({...newInstitute, address: value})}
            />
            <div className={styles.popup__buttons}>
              <Button 
                onClick={()=>{setDisplayAddInstitute(false);setNewInstitute({name: '', shortName: '', address: ''})}} 
                size={'max'} variant={'whiteMain'}>
                  Отменить
              </Button>
              <Button size={'max'} variant={'primary'}>Сохранить</Button>
            </div>
          </div>
        </PopupContainer>
      }
    </>
  )
}