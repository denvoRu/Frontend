import './app.scss'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from '../../pages/login/login';
import Header from '../header/header';
import Main from '../../pages/main/main';
import Teachers from '../../pages/teachers/teachers';
import Subject from '../../pages/entities/subject';
import Teacher from '../../pages/entities/teacher';
import Institute from '../../pages/main/institute';
import Subjects from '../../pages/modules/modules';
import { useEffect, useState } from 'react';
import { AppContext, ProviderProps } from '../../contexts/appContext';
import ModulePage from '../../pages/entities/module';
import Schedule from '../../pages/schedule/schedule';
import StatisticsPage from '../../pages/statistics/statistics';
import FeedBack from '../../pages/feedback/feedback';
import { getRole } from '../../services/role';

function App() {

  function OutletWrapper() {

    const navigate = useNavigate()

    useEffect(()=>{
      const role = getRole()
      console.log(role)
      if (!role) {
        navigate('/login')
      }
    },[navigate])

    return (
      <>
        <Header />
        <div className={'body'}>
          <Outlet />
        </div>
      </>
    )
  }

  return (
    <BrowserRouter>
    <AppProvider>
      <HelmetProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<OutletWrapper />}>
            <Route index element={<Navigate to={getRole() === 'admin'? "/institutes" : '/me/schedule'} replace />} />
            <Route path="/institutes" element={<Main />} />
            <Route path='/institutes/:id' element={<Institute/>} />
            <Route path='/modules' element={<Subjects/>} />
            <Route path='/modules/:id' element={<ModulePage/>} />
            <Route path='/modules/:id/:subjectId' element={<Subject/>}/>
            <Route path='/teachers' element={<Teachers/>} />
            <Route path='/teachers/:id' element={<Teacher/>} />
            <Route path='/teachers/:id/schedule' element={<Schedule/>}/>
            <Route path='/teachers/:id/schedule/:subjectId' element={<Schedule/>}/>
            <Route path='/teachers/:id/schedule/:lessonId/statistics' element={<StatisticsPage/>}/>

            <Route path='/me' element={<Teacher/>}/>
            <Route path='/me/schedule' element={<Schedule/>}/>
            <Route path='/me/schedule/:subjectId' element={<Schedule/>}/>
            <Route path='/me/schedule/:lessonId/statistics' element={<StatisticsPage/>}/>
          </Route>
          <Route path='/:id' element={<FeedBack/>}/>
        </Routes>
      </HelmetProvider>
    </AppProvider>
    </BrowserRouter>
  )
}

export const AppProvider = ({ children }: ProviderProps) => {

  const [instituteId, setInstituteId] = useState('')

  return (
    <AppContext.Provider value={{ instituteId, setInstituteId }}>
      {children}
    </AppContext.Provider>
  )
}

export default App
