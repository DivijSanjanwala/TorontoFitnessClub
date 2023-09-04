import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function Login(props) {

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [successValue, setSuccessvalue] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const changeUsername = (username) => {
        setUsername(username)
    }

    const changePassword = (password) => {
        setPassword(password)
    }

    const toSignup = () =>  {
        navigate('/signup')
      }

      const toMain = () => {
        navigate('/home/')
      }
    const sendPost = async (e) => {
        try{
          e.preventDefault()      

        const response = await fetch(`http://localhost:8000/accounts/login/`,{
            method: "POST", 
            body: JSON.stringify({
                username: username,
                password: password,
              }),     headers: {
                "Content-Type": "application/json",
              },
        });
        // console.log(response)
        const data = await response.json();
  
        const {access, refresh} = data
        if (refresh && access){
          
          setError('')
          props.setToken(access)
          props.setRefresh(refresh)

          toMain()
        }
        else {
          const {detail} = data 
          setSuccessvalue(false)
          setError(detail)
          // console.log('gg')
          console.log(error)
          console.log(detail)
          // console.log(error + 'a')
        }
      
    } catch(err){
      // console.log('gg')
        console.log(err)
    }
    }
        
    return (
      <div class="bg-grey-lighter min-h-screen flex flex-col">
      <div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 class="mb-8 text-3xl text-center">Login</h1>
        <form onSubmit={sendPost} >
            {!successValue &&
            <p className='block border border-grey-light w-full p-3 rounded mb-4'> {error}, try again!  </p>
            }
            <input 
              type="text"
              class="block border border-grey-light w-full p-3 rounded mb-4"
              name="username"
              placeholder="Username" 
              id="username" value={username} required onChange={(e) => changeUsername(e.currentTarget.value)}
              />

            <input 
              type="password"
              class="block border border-grey-light w-full p-3 rounded mb-4"
              name="password"
              placeholder="Password" 
              id="password" value={password} required onChange={(e) => changePassword(e.currentTarget.value)}
              />
              
            <div className='flex flex-col items-center gap-2'>
              <div>
              <button
                type="submit"
                class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full">Login</button>
              </div>
              <div>
              <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full" onClick={toSignup}>Signup Instead</button>
              </div>
            </div>
          </form>
        </div></div></div>
    )
}
export default Login;