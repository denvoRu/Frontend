import { Helmet } from 'react-helmet-async'
import styles from './login.module.scss'
import { useState } from 'react'
import {Input} from '../../components/input/Input'
import { Button } from '../../components/button/button'
import axios, { PagesURl } from '../../services/api';
import { useNavigate } from 'react-router-dom'
import { LoginResponse } from '../../types/auth'
import { setTokensToCookies } from '../../services/token'

export default function Login() {

  const [loginAsTeacher, setLoginAsTecher] = useState(true)

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onLogin = async () => {
    try {
      const {data} = await axios.post<LoginResponse>(PagesURl.AUTH + '/login', {
        role: loginAsTeacher ? 'teacher':'admin',
        username: login,
        password: password
      }, {
        headers: {
          'Content-Type':"application/x-www-form-urlencoded"
        }
      })
      setTokensToCookies(data.access_token, 'access')
      setTokensToCookies(data.refresh_token, 'refresh')
      navigate('/institutes')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Helmet>
        <title>Вход</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.content}>
            <h1 className={styles.content__title}>Вход</h1>
            <div className={styles.content__tabs}>
              <p onClick={() => setLoginAsTecher(true)} className={`${styles.content__tab} ${loginAsTeacher ? styles.content__tab_active : ''}`}>Преподаватель</p>
              <p onClick={() => setLoginAsTecher(false)} className={`${styles.content__tab} ${!loginAsTeacher ? styles.content__tab_active : ''}`}>Администратор</p>
            </div>
            <div className={styles.content__inputs}>
              <Input type='email' required placeholder='Почта' onChange={setLogin} value={login}/>
              <Input type='password' required placeholder='Пароль' onChange={setPassword} value={password}/>
            </div>
            <div className={styles.content__buttons}>
              <Button onClick={()=>{}} className={styles.content__forget} size={'max'} variant={'whiteMain'}>Забыли пароль?</Button>
              <Button onClick={onLogin} className={styles.content__submit} size={'max'}>Войти</Button>
            </div>
            <p className={styles.content__support}>По всем вопросам можете обращаться: adminexanple@gmail.com</p>
        </div>
      </div>
    </>
  )
}