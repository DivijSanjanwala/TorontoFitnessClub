import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function Signup() {
    const [firstname, setFirstname] = useState(null)
    const [lastname, setLastname] = useState(null)
    const [password, setPassword] = useState(null)
    const [email, setEmail] = useState(null)
    const [phonenumber, setPhoneNumber] = useState(null)
    const [username, setUsername] = useState(null)
    const [successvalue, setSuccessvalue] = useState(true)
    const [error, setError] = useState(null)
    // let error = ''
    const navigate = useNavigate()
    const changeFirstname = (firstname) =>  {
        setFirstname(firstname)
      }

    const changeLastname = (lastname) =>  {
        setLastname(lastname)
      }

    const changePassword = (password) => {
        setPassword(password)
    }

    
    const changeEmail = (email) => {
        setEmail(email)
    }
        
    const changePhone = (phone) => {
        setPhoneNumber(phone)
    }
    const changeUsername = (username) => {
      setUsername(username)
    }
    const toLogin = () => {
      navigate('/')
      console.log('changeroute')
    }

    const sendPost = async (e) => {
      try{
        e.preventDefault()      

      const typeresponse = await fetch(`http://localhost:8000/accounts/signup/`,{
          method: "POST", 
          body: JSON.stringify({
              username: username,
              first_name: firstname,
              last_name: lastname,
              email: email,
              password: password,
              phonenumber: phonenumber
            }),     headers: {
              "Content-Type": "application/json",
            },
      }
      
      );
      
      const data = await typeresponse.json();
      const {success} = data 
      if (success == true) {
        setSuccessvalue(true)
        setError(null)
        console.log('amazing')
        toLogin()
      }
      else {
        setSuccessvalue(false)
        const {msg} = data
        setError(msg)
      }
    }
    catch(err) {
      console.log(error.message)
    }
  }

return (
  <div class="bg-grey-lighter min-h-screen flex flex-col">
      <div class="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
              <h1 class="mb-8 text-3xl text-center">Sign up</h1>
              <form onSubmit={sendPost}>
                {!successvalue &&
                <p className='block border border-grey-light w-full p-3 rounded mb-4'> {error}, try again!</p>
                }
              <input 
                  type="text"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="username"
                  placeholder="Username" 
                  id="username" value={username} required onChange={(e) => changeUsername(e.currentTarget.value)}
                  />

              <input 
                  type="text"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="firstname"
                  placeholder="First Name" 
                  id="firstname" value={firstname} required onChange={(e) => changeFirstname(e.currentTarget.value)}
                  />
              <input 
                  type="text"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="lastname"
                  placeholder="Last Name" 
                  id="lastname" value={lastname} required onChange={(e) => changeLastname(e.currentTarget.value)}
                  />

              <input 
                  type="password"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="password"
                  placeholder="Password" 
                  id="password" value={password} required onChange={(e) => changePassword(e.currentTarget.value)}
                  />

              <input 
                  type="text"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="email"
                  placeholder="Email" 
                  id="email" value={email} required onChange={(e) => changeEmail(e.currentTarget.value)}
                  />

              <input 
                  type="text"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="phone"
                  placeholder="Phone Number" 
                  id="phone" value={phonenumber} required onChange={(e) => changePhone(e.currentTarget.value)}
                  /></form>
              <div className='flex flex-col items-center'>
              <button
                  type="submit"
                  class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full"
              >Create Account</button>
              </div>
              <div class="text-center text-sm text-grey-dark mt-4">By signing up, you agree to the <a class="no-underline border-b border-grey-dark text-grey-dark" href="#">Terms of Service</a> and <a class="no-underline border-b border-grey-dark text-grey-dark" href="#">Privacy Policy</a>
              </div>
          </div>
          <div class="text-grey-dark mt-6">Already have an account? <button onClick={toLogin} class="no-underline border-b border-blue text-blue">Log in</button>.
          </div>
      </div>
  </div>
    
    )
     }

export default Signup;