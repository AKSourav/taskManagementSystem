import React from 'react'
import Auth from './Components/Auth/Auth'
import Navbar from './Components/Navbar/Navbar'
import {Route,Routes} from 'react-router-dom';
import Tasks from './Components/Tasks/Tasks';
import Profile from './Components/Profile/Profile';

const App = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/tasks' element={<Tasks/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='*' element={<Tasks/>} />
      </Routes>
    </>
  )
}

export default App