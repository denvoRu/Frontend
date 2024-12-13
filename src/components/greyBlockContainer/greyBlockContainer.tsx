import styles from './greyBlockContainer.module.scss'

type GreyBlockProps = {
  children: JSX.Element
}

export default function GreyBlockContainer(props:GreyBlockProps) {
  return (
    <div className={styles.container}>
      {props.children}
    </div>
  )
}