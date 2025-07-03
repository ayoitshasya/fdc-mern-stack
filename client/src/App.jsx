import React from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'

function App() {


  return (
    <>
    <div className='h-screen flex flex-col'>
      <div  className='h-10 bg-[#B7202E] w-full z-10 top-0'></div>
      <div className='bg-[url(/campus.jpg)] bg-cover w-screen flex justify-center items-center flex-1'>
          <Signup/>
      </div>
    </div>
      
    </>
  )
}

export default App
