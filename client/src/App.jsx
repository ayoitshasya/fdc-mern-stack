import React from 'react'
import Signup from './pages/Login'
import Home from './pages/Home'

function App() {


  return (
    <>
      <div  className='h-10 bg-[#B7202E] w-full fixed z-10 top-0'></div>
      <div className='bg-[url(/campus.jpg)] bg-cover h-screen w-screen flex justify-center items-center'>
          <Home/>
      </div>
    </>
  )
}

export default App
