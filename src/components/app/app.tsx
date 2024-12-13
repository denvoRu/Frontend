import './App.scss'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from '../../pages/login/login';
import Header from '../header/header';
import Main from '../../pages/main/main';
import Subjects from '../../pages/subjects/subjects';
import Teachers from '../../pages/teachers/teachers';
import Subject from '../../pages/subject/subject';
import Teacher from '../../pages/teacher/teacher';

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
            <Route path='/subjects/:id' element={<Subject/>} />
            <Route path='/teachers' element={<Teachers/>} />
            <Route path='/teachers/:id' element={<Teacher/>} />
          </Route>
        </Routes>
      </HelmetProvider>
    </BrowserRouter>
  )
}

export default App
