import { Helmet } from 'react-helmet-async'
import styles from './main.module.scss'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useContext, useEffect, useState } from 'react'
import { RAITING_LIST } from '../../consts/raitingList'
import { updateRadioButtonList } from '../../utils/list'
import { Link } from 'react-router-dom'
import { Button } from '../../components/button/button'
import PopupContainer from '../../components/popupContainer/popupContainer'
import { Input } from '../../components/input/Input'
import axios, { PagesURl } from '../../services/api';
import { Institutes } from '../../types/institutes'
import { FilterParams } from '../../types/filter'
import GreyBlockContainer from '../../components/greyBlockContainer/greyBlockContainer'
import { AppContext } from '../../contexts/appContext'
import { setInstituteId } from '../../services/institute'

export default function Main() {

  const context = useContext(AppContext)

  const [displayWelcome, setDisplayWelcome] = useState(true)

  const [sortList, setSortList] = useState(RAITING_LIST)
  const [isOpenList, setIsOpenList] = useState(false)

  const [statistics, setStatistics] = useState<Institutes>()

  const [displayAddInstitute, setDisplayAddInstitute] = useState(false)
  
  const [newInstitute, setNewInstitute] = useState({name: '', short_name: '', address: ''})

  const onChangeSortList = (value: string) => {
    setSortList(updateRadioButtonList(value, sortList))
    setIsOpenList(false)
    const activeValue = sortList.filter((point)=>(point.value === value))[0]
    getInstitutes({
      sort: activeValue.backName,
      desc: activeValue.desc
    })
  }
  const getInstitutes = async (params?:FilterParams) => {
    const response = await axios.get<Institutes>(PagesURl.INSTITUTE, {
      params: params
    })
    setStatistics(response.data)
  }
  const createInstitute = async () => {
    setDisplayAddInstitute(false)
    await axios.post<Institutes>(PagesURl.INSTITUTE, newInstitute)
    getInstitutes()
  }

  useEffect (()=>{
    getInstitutes()
  },[context])

  if (!statistics){
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>Главная</title>
      </Helmet>
      <div className={styles.container}>
        {displayWelcome && <GreyBlockContainer style={{marginBottom: '24px'}}>
          <>
            <div className={styles.welcome}>
              <Icon glyph='profile'/>
              <h2 className={styles.welcome__title}>Добро пожаловать в Student Voice!</h2>
              <svg onClick={()=>{setDisplayWelcome(false)}} className={styles.welcome__close} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#DDDDDD" />
                  <path d="M13.0604 12L15.3604 9.69998C15.6504 9.40998 15.6504 8.92999 15.3604 8.63999C15.0704 8.34999 14.5904 8.34999 14.3004 8.63999L12.0004 10.94L9.70035 8.63999C9.41035 8.34999 8.93035 8.34999 8.64035 8.63999C8.35035 8.92999 8.35035 9.40998 8.64035 9.69998L10.9404 12L8.64035 14.3C8.35035 14.59 8.35035 15.07 8.64035 15.36C8.79035 15.51 8.98035 15.58 9.17035 15.58C9.36035 15.58 9.55035 15.51 9.70035 15.36L12.0004 13.06L14.3004 15.36C14.4504 15.51 14.6404 15.58 14.8304 15.58C15.0204 15.58 15.2104 15.51 15.3604 15.36C15.6504 15.07 15.6504 14.59 15.3604 14.3L13.0604 12Z" fill="#666666" />
                </g>
              </svg>
            </div>
            <p className={styles.welcome__text}>Сервис для оценки учебных занятий. Ознакомьтесь со статистикой университета!</p>
          </>
        </GreyBlockContainer>}
        <div className={styles.container__firstLine}>
          <div className={styles.container__titleBlock}>
            <Icon glyph='rating' size={42} />
            <h1 className={styles.container__title}>Рейтинг университета</h1>
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
            {statistics.content.map((statistic) => (
              <Link onClick={()=>{context?.setInstituteId(statistic.id);setInstituteId(statistic.id)}} to={`/institutes/${statistic.id}`} className={`${styles.statistics__point} ${isOpenList ? 'opacity' : ''}`} key={statistic.name} style={{ width: `${statistic.rating < 35 ? 35 : statistic.rating}%` }}>
                <p>{statistic.short_name}</p>
                <div className={styles.statistics__block}>
                  <p>{statistic.rating}</p>
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
              value={newInstitute.short_name} 
              onChange={(value)=>setNewInstitute({...newInstitute, short_name: value})}
            />
            <Input 
              placeholder='Введите адрес института' 
              value={newInstitute.address} 
              onChange={(value)=>setNewInstitute({...newInstitute, address: value})}
            />
            <div className={styles.popup__buttons}>
              <Button 
                onClick={()=>{setDisplayAddInstitute(false);setNewInstitute({name: '', short_name: '', address: ''})}} 
                size={'max'} variant={'whiteMain'}>
                  Отменить
              </Button>
              <Button onClick={createInstitute} size={'max'} variant={'primary'}>Сохранить</Button>
            </div>
          </div>
        </PopupContainer>
      }
    </>
  )
}