import { Helmet } from 'react-helmet-async'
import styles from './main.module.scss'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useCallback, useEffect, useState } from 'react'
import { RAITING_LIST } from '../../consts/raitingList'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { updateRadioButtonList } from '../../utils/list'
import LocationLinks from '../../components/locationLinks/locationLinks'
import GreyBlockContainer from '../../components/greyBlockContainer/greyBlockContainer'
import { Button } from '../../components/button/button'
import PopupContainer from '../../components/popupContainer/popupContainer'
import { Input } from '../../components/input/Input'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { PagesURl } from '../../services/api';
import { Institute } from '../../types/institutes'
import { Modules } from '../../types/module'
import { FilterParams } from '../../types/filter'
import { removeInstituteId } from '../../services/institute'

export default function InstitutePage() {

  const params = useParams()
  const navigate = useNavigate()

  const [instituteId, setInstituteId] = useState<string>()
  const [institute, setInstitute] = useState<Institute>()

  const [sortList, setSortList] = useState(RAITING_LIST)
  const [isOpenList, setIsOpenList] = useState(false)

  const [displayDelete, setDisplayDelete] = useState(false)

  const [changeValue, setChangeValue] = useState({name: '', short_name: '', address: ''})

  const [displayChange, setDisplayChange] = useState(false)

  const [statistics, setStatistics] = useState<Modules>()

  const getModules = useCallback(async (params?: FilterParams) => {
    try {
      const {data} = await axios.get<Modules>(PagesURl.MODULE, {
        params: {
          institute_id: instituteId,
          ...params
        }
      })
      console.log(data)
      setStatistics(data)
    } catch (error) {
      console.log(error)
    }
  },[instituteId])

  const getInstitute = useCallback(async () => {
    try {
      const {data} = await axios.get<Institute>(PagesURl.INSTITUTE + `/${instituteId}`)
      setInstitute(data)
      setChangeValue({name: data.name, short_name: data.short_name, address: data.address})
    } catch (error) {
      console.log(error)
    }
  },[instituteId])

  const changeInstituteField = async () => {
    try {
      await axios.patch(PagesURl.INSTITUTE + `/${instituteId}`, changeValue)
      getInstitute()
    } catch (error) {
      console.log(error)
    }
  }
  const deleteInstitute = async () => {
    try {
      await axios.delete(PagesURl.INSTITUTE + `/${instituteId}`)
      navigate(-1)
      removeInstituteId()
    } catch (error) {
      console.log(error)
    }
  }

  const onChangeSortList = (value: string) => {
    setSortList(updateRadioButtonList(value, sortList))
    setIsOpenList(false)
    const activeValue = sortList.filter((point)=>(point.value === value))[0]
    getModules({
      sort: activeValue.backName,
      desc: activeValue.desc
    })
  }

  const onResetChange = () => {
    setChangeValue({name: '', short_name: '', address: ''})
    setDisplayChange(false)
  }

  useEffect(()=>{
    if (params.id){
      setInstituteId(params.id)
    }
  },[params])
  useEffect(()=>{
    if (instituteId) {
      getInstitute()
      getModules()
    }
  },[instituteId, getInstitute, getModules])

  if (!institute || !statistics) {
    return <></>
  }

  return (
    <>
      <Helmet>
        <title>{institute.short_name}</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramName={institute.short_name} />
        <div className={styles.container__sort}>
          <div className={styles.settings}>
            <Button onClick={() => setDisplayChange(true)} variant={'whiteMain'}>
              <span
                className={`${styles.container__settings}`}>
                  Изменить
              </span>
              <Icon glyph='edit' glyphColor={'grey'} />
            </Button>
          </div>
          <Button onClick={() => { setDisplayDelete(true) }} variant={'whiteMain'}>
            <Icon glyph='trash' glyphColor='dangerous' />
            <span className={styles.container__settings_red}>Удалить</span>
          </Button>
        </div>
        <GreyBlockContainer>
          <div className={`${styles.info}`}>
            <div className={styles.info__content}>
              <div className={styles.info__titleBlock}>
                <Icon containerStyle={styles.info__titleIcon} glyph='institute' />
                <h1 className={styles.info__title}>{institute.name}</h1>
              </div>
              <p className={styles.info__text}><span className={styles.info__text_mobile}>{institute.short_name}&nbsp;</span>{`${institute.address}`}</p>
            </div>
            <p className={styles.info__raiting}>{`Рейтинг: ${institute.rating}`}</p>
          </div>
        </GreyBlockContainer>
        <div style={{ marginTop: '24px' }} className={styles.statisticsBlock}>
          <div className={styles.statistics__titleBlock}>
            <div className={styles.statistics__titleMobile}>
              <h3 className={styles.statistics__title}>Рейтинг института</h3>
              <p className={styles.statistics__raiting}>{institute.rating}</p>
            </div>
            <SortBlock
              title='По рейтингу' icon='sort' list={sortList} type='radioButton'
              onChange={onChangeSortList}
              isOpenList={isOpenList}
              changeIsOpenList={() => setIsOpenList(!isOpenList)}
            />
          </div>
          <div className={styles.statistics}>
            {statistics.content.map((statistic) => (
              <div key={statistic.name} className={`${styles.statistics__point} ${styles.statistics__point_blue} ${isOpenList ? 'opacity' : ''}`} style={{ width: `${statistic.rating *20 > 30 ? statistic.rating*20 : 30}%` }}>
                <p>{statistic.name}</p>
                <p>{statistic.rating}</p>
              </div>
            ))}
          </div>
        </div>
        <BottomLinks />
      </div>
      {displayDelete &&
        <PopupContainer>
          <div className={styles.popup}>
            <h1 className={styles.popup__title}>Удалить {institute.short_name}</h1>
            <p className={styles.popup__text}>Вы дейсвительно хотите удалить институт без возможности восстановления?</p>
            <div className={styles.popup__buttons}>
              <Button
                onClick={() => { setDisplayDelete(false) }}
                size={'max'} variant={'whiteMain'}>
                Отменить
              </Button>
              <Button onClick={deleteInstitute} size={'max'} variant={'secondary'}>Удалить</Button>
            </div>
          </div>
        </PopupContainer>
      }
      {displayChange &&
        <PopupContainer>
          <div className={styles.popup}>
            <h1 className={styles.popup__title}>Изменить информацию об институте</h1>
            <Input placeholder='Введите новое полное название' value={changeValue.name} onChange={(val)=>{setChangeValue({...changeValue, name: val})}}/>
            <Input placeholder='Введите новое короткое название' value={changeValue.short_name} onChange={(val)=>{setChangeValue({...changeValue, short_name: val})}}/>
            <Input placeholder='Введите новый адрес института' value={changeValue.address} onChange={(val)=>{setChangeValue({...changeValue, address: val})}} />
            <div className={styles.popup__buttons}>
              <Button
                onClick={() => { onResetChange() }}
                size={'max'} variant={'whiteMain'}>
                Отменить
              </Button>
              <Button onClick={()=>{changeInstituteField();onResetChange()}} size={'max'} variant={'primary'}>Сохранить</Button>
            </div>
          </div>
        </PopupContainer>
      }
    </>
  )
}