import { Helmet } from 'react-helmet-async'
import styles from './main.module.scss'
import { Icon } from '../../components/icon'
import SortBlock from '../../components/sortBlock/sortBlock'
import { useState } from 'react'
import { RAITING_LIST } from '../../consts/raitingList'
import { SUBJECT_STATISTICS } from '../../mocks/subjectsStatistics'
import BottomLinks from '../../components/bottomLinks/bottomLinks'
import { updateRadioButtonList } from '../../utils/list'
import LocationLinks from '../../components/locationLinks/locationLinks'
import GreyBlockContainer from '../../components/greyBlockContainer/greyBlockContainer'
import { Button } from '../../components/button/button'
import PopupContainer from '../../components/popupContainer/popupContainer'
import { Input } from '../../components/input/Input'

export default function Institute() {

  const [sortList, setSortList] = useState(RAITING_LIST)
  const [isOpenList, setIsOpenList] = useState(false)

  const [displayDelete, setDisplayDelete] = useState(false)
  const [displaySettings, setDisplaySettings] = useState(false)

  const [changeValue, setChangeValue] = useState('')

  const [displayChangeName, setDisplayChangeName] = useState(false)
  const [displayChangeShortName, setDisplayChangeShortName] = useState(false)
  const [displayChangeAddress, setDisplayChangeAddress] = useState(false)

  const [statistics,] = useState(SUBJECT_STATISTICS)

  const onChangeSortList = (value: string) => {
    setSortList(updateRadioButtonList(value, sortList))
    setIsOpenList(false)
  }

  const onResetChange = (func: (bool: boolean) => void) => {
    func(false)
    setChangeValue('')
  }

  return (
    <>
      <Helmet>
        <title>ИРИТ-РТФ</title>
      </Helmet>
      <div className={styles.container}>
        <LocationLinks paramName='ИРИТ-РТФ' />
        <div className={styles.container__sort}>
          <div className={styles.settings}>
            <Button onClick={() => setDisplaySettings(!displaySettings)} variant={displaySettings ? 'primary' : 'whiteMain'}>
              <span 
                className={`${styles.container__settings} ${displaySettings ? styles.container__settings_white : ''}`}>
                  Настройки
              </span>
              <Icon glyph='dropdown' glyphColor={displaySettings ? 'white' : 'grey'} />
            </Button>
            {displaySettings &&
              <div className={styles.settings__list}>
                <div onClick={()=>{setDisplayChangeName(true);setDisplaySettings(false)}} className={styles.settings__point}>
                  <p>Изменить полное название института</p>
                  <Icon glyph='arrow-right' glyphColor='grey' />
                </div>
                <div onClick={()=>{setDisplayChangeShortName(true);setDisplaySettings(false)}} className={styles.settings__point}>
                  <p>Изменить короткое название института</p>
                  <Icon glyph='arrow-right' glyphColor='grey' />
                </div>
                <div onClick={()=>{setDisplayChangeAddress(true);setDisplaySettings(false)}} className={styles.settings__point}>
                  <p>Изменить адрес</p>
                  <Icon glyph='arrow-right' glyphColor='grey' />
                </div>
              </div>
            }
          </div>
          <Button onClick={() => { setDisplayDelete(true) }} variant={'whiteMain'}>
            <Icon glyph='trash' glyphColor='dangerous' />
            <span className={styles.container__settings_red}>Удалить</span>
          </Button>
        </div>
        <GreyBlockContainer displayOpacity={displaySettings}>
          <div className={`${styles.info}`}>
            <div className={styles.info__content}>
              <div className={styles.info__titleBlock}>
                <Icon containerStyle={styles.info__titleIcon} glyph='institute' />
                <h1 className={styles.info__title}>Институт радиоэлектроники и информационных технологий-РТФ</h1>
              </div>
              <p className={styles.info__text}>ИРИТ-РТФ Россия, г. Екатеринбург, ул. Мира 32</p>
            </div>
            <p className={styles.info__raiting}>Рейтинг: 99</p>
          </div>
        </GreyBlockContainer>
        <div style={{ marginTop: '24px' }} className={styles.statisticsBlock}>
          <div className={styles.statistics__titleBlock}>
            <div className={styles.statistics__titleMobile}>
              <h3 className={styles.statistics__title}>Рейтинг института</h3>
              <p className={styles.statistics__raiting}>99</p>
            </div>
            <SortBlock
              title='По рейтингу' icon='sort' list={sortList} type='radioButton'
              onChange={onChangeSortList}
              isOpenList={isOpenList}
              changeIsOpenList={() => setIsOpenList(!isOpenList)}
            />
          </div>
          <div className={styles.statistics}>
            {statistics.map((statistic) => (
              <div className={`${styles.statistics__point} ${styles.statistics__point_blue} ${isOpenList ? 'opacity' : ''}`} key={statistic.name} style={{ width: `${statistic.percent}%` }}>
                <p>{statistic.name}</p>
                <p>{statistic.percent}</p>
              </div>
            ))}
          </div>
        </div>
        <BottomLinks />
      </div>
      {displayDelete &&
        <PopupContainer>
          <div className={styles.popup}>
            <h1 className={styles.popup__title}>Удаление института</h1>
            <p className={styles.popup__text}>Вы дейсвительно хотите удалить институт без возможности восстановления?</p>
            <div className={styles.popup__buttons}>
              <Button
                onClick={() => { setDisplayDelete(false) }}
                size={'max'} variant={'whiteMain'}>
                Отменить
              </Button>
              <Button size={'max'} variant={'secondary'}>Удалить</Button>
            </div>
          </div>
        </PopupContainer>
      }
      {displayChangeName &&
        <PopupContainer>
          <div className={styles.popup}>
            <h1 className={styles.popup__title}>Изменить полное название института</h1>
            <Input placeholder='Введите новое полное название' value={changeValue} onChange={setChangeValue}/>
            <div className={styles.popup__buttons}>
              <Button
                onClick={() => { onResetChange(setDisplayChangeName) }}
                size={'max'} variant={'whiteMain'}>
                Отменить
              </Button>
              <Button size={'max'} variant={'primary'}>Сохранить</Button>
            </div>
          </div>
        </PopupContainer>
      }
      {displayChangeShortName &&
        <PopupContainer>
          <div className={styles.popup}>
            <h1 className={styles.popup__title}>Изменить короткое название института</h1>
            <Input placeholder='Введите новое короткое название' value={changeValue} onChange={setChangeValue}/>
            <div className={styles.popup__buttons}>
              <Button
                onClick={() => { onResetChange(setDisplayChangeShortName) }}
                size={'max'} variant={'whiteMain'}>
                Отменить
              </Button>
              <Button size={'max'} variant={'primary'}>Сохранить</Button>
            </div>
          </div>
        </PopupContainer>
      }
      {displayChangeAddress &&
        <PopupContainer>
          <div className={styles.popup}>
            <h1 className={styles.popup__title}>Изменить адрес института</h1>
            <Input placeholder='Введите новый адрес института' value={changeValue} onChange={setChangeValue} />
            <div className={styles.popup__buttons}>
              <Button
                onClick={() => { onResetChange(setDisplayChangeAddress) }}
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