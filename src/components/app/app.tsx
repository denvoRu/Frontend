import './App.scss'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from '../../pages/login/login';
import Header from '../header/header';
import Main from '../../pages/main/main';

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
            <Route path="/main" element={<Main />} />
          </Route>
        </Routes>
      </HelmetProvider>
    </BrowserRouter>
  )
}

export default App
