import { Helmet } from 'react-helmet-async'
import styles from './login.module.scss'
import { useState } from 'react'
import {Input} from '../../components/input/Input'
import { Button } from '../../components/button/button'

export default function Login() {

  const [loginAsTecher, setLoginAsTecher] = useState(true)

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = () => {

  }

  return (
    <>
      <Helmet>
        <title>Вход</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.container__logo}>Тут будет логотип</div>
        <form className={styles.content} onSubmit={onLogin}>
            <h1 className={styles.content__title}>Вход</h1>
            <div className={styles.content__tabs}>
              <p onClick={() => setLoginAsTecher(true)} className={`${styles.content__tab} ${loginAsTecher ? styles.content__tab_active : ''}`}>Преподаватель</p>
              <p onClick={() => setLoginAsTecher(false)} className={`${styles.content__tab} ${!loginAsTecher ? styles.content__tab_active : ''}`}>Администратор</p>
            </div>
            <div className={styles.content__inputs}>
              <Input type='email' required placeholder='Почта' onChange={setLogin} value={login}/>
              <Input type='password' required placeholder='Пароль' onChange={setPassword} value={password}/>
            </div>
            <div className={styles.content__buttons}>
              <Button onClick={()=>{}} className={styles.content__forget} size={'max'} variant={'whiteMain'}>Забыли пароль?</Button>
              <Button className={styles.content__submit} size={'max'}>Войти</Button>
            </div>
            <p className={styles.content__support}>По всем вопросам можете обращаться: adminexanple@gmail.com</p>
        </form>
      </div>
    </>
  )
}