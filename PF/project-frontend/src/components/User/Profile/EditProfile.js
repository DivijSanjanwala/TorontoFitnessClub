import React, { useEffect } from "react";

import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

export default function EditProfile(props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [defaultFirstName, setDefaultFirstName] = useState("")
  const [defaultLastName, setDefaultLastName] = useState("")
  const [defaultEmail, setDefaultEmail] = useState("")
  const [successvalue, setSuccessvalue] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const toLogin = () => {
    navigate('/')
    console.log('changeroute')
  }


  useEffect(() => {
    const getResponse = async () => {
        const response = await fetch(`${props.baseURL}/accounts/userinfo/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${props.token}`,
            }
        })

        const data = await response.json()

        console.log(data.data)
      
        if (data.success) {
            setDefaultFirstName(data.data.first_name)
            setDefaultLastName(data.data.last_name)
            setDefaultEmail(data.data.email)
        } else {
            navigate('/page-not-found', {state: {message: data.msg}})
        }
    }
    getResponse()
}, [])

  const sendPost = async (e) => {
    try{
      console.log('divij')
      e.preventDefault()
      const typeresponse = await fetch(`${props.baseURL}/accounts/edit_profile/`,{
          method: "POST", 
          body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              email: email,
            }),     
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${props.token}`,
        }
    })
    
    const data = await typeresponse.json();
    console.log('divij')

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
              <h1 class="mb-8 text-3xl text-center">Edit Profile</h1>
              <form onSubmit={(e) => {sendPost(e)}}>
                {!successvalue &&
                <p className='block border border-grey-light w-full p-3 rounded mb-4'> {error}, try again!</p>
                }
              <input 
                  type="text"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="firstname"
                  placeholder="First Name" 
                  id="firstname" defaultValue={defaultFirstName} required onChange={(e) => setFirstName(e.currentTarget.value)}
                  />
              <input 
                  type="text"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="lastname"
                  placeholder="Last Name" 
                  id="lastname" defaultValue={defaultLastName} required onChange={(e) => setLastName(e.currentTarget.value)}
                  />
              <input 
                  type="text"
                  class="block border border-grey-light w-full p-3 rounded mb-4"
                  name="email"
                  id="email" defaultValue={defaultEmail} required 
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  />
                <div className='flex flex-col items-center'>
              <button
                  type="submit"
                  class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full"
              >Edit Account details</button>
              </div>  
                  </form>
              
          </div>
      </div>
  </div>  
    )}