import styles from './greyBlockContainer.module.scss'

type GreyBlockProps = {
  children: JSX.Element
  displayOpacity?: boolean
}

export default function GreyBlockContainer(props:GreyBlockProps) {
  return (
    <div className={`${styles.container} ${props.displayOpacity ? 'opacity' : ''}`}>
      {props.children}
    </div>
  )
}