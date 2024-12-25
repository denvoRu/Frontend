import { CSSProperties } from 'react'
import styles from './greyBlockContainer.module.scss'

type GreyBlockProps = {
  children: JSX.Element
  displayOpacity?: boolean
  style?:CSSProperties
}

export default function GreyBlockContainer(props:GreyBlockProps ) {
  return (
    <div style={props.style} className={`${styles.container} ${props.displayOpacity ? 'opacity' : ''}`}>
      {props.children}
    </div>
  )
}