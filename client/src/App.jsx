import React from 'react'
import { useEffect } from 'react';
import AppRoutes from './Routes.jsx'
import { useUser } from './context/UserContext.jsx'

function App() {
  const { user, loggedIn, loading, setUser, setLoggedIn, setLoading } = useUser();

  useEffect(() => {
    const checkLogin = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/auth/check-auth", {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        if (res.ok && data.loggedIn) {
          setUser(data.user);
          setLoggedIn(true);
          setLoading(false); 
        } else {
          setUser(null);
          setLoggedIn(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking login:", err);
        setUser(null);
        setLoggedIn(false);
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if(loading) return(
    <div className='h-screen w-screen bg-white'></div>
  )

  return (
    <>
      <div className='h-screen flex flex-col'>
        <div  className='h-6 bg-[#B7202E] w-full text-[#B7202E]'>.</div>
        <div className='bg-[url(/campus.jpg)] bg-cover w-full flex-1'>

              <AppRoutes />
        </div>
      </div>
    </>
  )
}

export default App
