import styles from './popupContainer.module.scss'

type PopupContainerProps = {
  children: JSX.Element
}

export default function PopupContainer ({children}:PopupContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.container__content}>
        {children}
      </div>
    </div>
  )
}