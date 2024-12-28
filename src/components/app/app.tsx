import './app.scss'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from '../../pages/login/login';
import Header from '../header/header';
import Main from '../../pages/main/main';
import Teachers from '../../pages/teachers/teachers';
import Subject from '../../pages/entities/subject';
import Teacher from '../../pages/entities/teacher';
import Institute from '../../pages/main/institute';
import Subjects from '../../pages/modules/modules';
import { useState } from 'react';
import { AppContext, ProviderProps } from '../../contexts/appContext';

function App() {

  function OutletWrapper() {

    //const navigate = useNavigate()

/*     useEffect(()=>{
      if (!getTokenFromCookie('access') || !getTokenFromCookie('refresh')){
        removeTokensFromCookies('access')
        removeTokensFromCookies('refresh')
        navigate('/login')
      } 
    },[navigate]) */

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
            <Route index element={<Navigate to="/institutes" replace />} />
            <Route path="/institutes" element={<Main />} />
            <Route path='/institutes/:id' element={<Institute/>} />
            <Route path='/modules' element={<Subjects/>} />
            <Route path='/modules/:id' element={<Subject/>} />
            <Route path='/teachers' element={<Teachers/>} />
            <Route path='/teachers/:id' element={<Teacher/>} />
          </Route>
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
