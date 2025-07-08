import React from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Application1 from './pages/Application/Application1'

function App() {


  return (
    <>
    <div className='h-screen flex flex-col'>
      <div  className='h-6 bg-[#B7202E] w-full z-10 top-0'></div>
      <div className='bg-[url(/campus.jpg)] bg-cover w-screen flex-1'>

          <Application1/>

          
      </div>
    </div>
      
    </>
  )
}

export default App
