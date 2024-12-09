import './App.scss'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from '../../pages/login/login';
import Header from '../header/header';
import Main from '../../pages/main/main';
import Subjects from '../../pages/subjects/subjects';
import Teachers from '../../pages/teachers/teachers';

function App() {

  function OutletWrapper() {
    return (
      <>
        <Header />
        <Outlet />
      </>
    )
  }

  return (
    <BrowserRouter>
      <HelmetProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<OutletWrapper />}>
            <Route path="/" element={<Main />} />
            <Route path='/subjects' element={<Subjects/>} />
            <Route path='/teachers' element={<Teachers/>} />
          </Route>
        </Routes>
      </HelmetProvider>
    </BrowserRouter>
  )
}

export default App
