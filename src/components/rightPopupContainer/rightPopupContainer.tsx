import styles from './rightPopupContainer.module.scss'

type RightPopupContainerProps = {
  children: JSX.Element
}

export default function RightPopupContainer({children}:RightPopupContainerProps){
  return (
    <div className={styles.container}>
      <div className={styles.container__content}>
        {children}
      </div>
    </div>
  )
}