import axios from 'axios'
import React, {useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addUser } from '../utils/userSlice'

import {useDispatch} from 'react-redux'
const ChatsHome = () => {
  const [searchUser, setSearchUser] = useState('')
  const [foundUsers, setFoundUsers] = useState('')
  const dispatch = useDispatch()
  
  function addUserId(userId){
    dispatch(addUser(userId))
    localStorage.setItem('userId', userId)
  }

  useEffect(() => {
    async function findUserWithName(){
        if(searchUser.trim() === '') return 
    
        try {
            const {data} = await axios.get('/api/v1/users/searchUser',  {
                params: {
                  searchUser: searchUser
                }
              })
            if(data.statusCode === 201){
               setFoundUsers(data?.data) 
            }
        } catch (error) {
          console.log(error);   
        }
      }
    findUserWithName()
  }, [searchUser])

  return (
    <div className="w-1/2 h-screen flex justify-center items-center mx-auto text-gray-200"> 
    
    <div className="flex flex-col p-2 gap-2 bg-black h-2/3">
    <form>
      <div className='flex gap-4'>
        <input type="text" className='text-black p-1 outline-none bg-gray-200' onChange={e => setSearchUser(e.target.value)} placeholder="Search User" />
        <button type='button' 
        onClick={() => {
            setSearchUser('')
            setFoundUsers('')
        }}
        className='bg-white p-2 text-black hover:bg-gray-200'> Clear </button>
      </div>
    </form>

    <div>
    {
    foundUsers ?
    foundUsers?.map(user => (
    <Link to="/chatspage" key={user._id} className='m-1'>
      <div onClick={() => addUserId(user._id)} 
      className='flex p-1 gap-4 bg-gray-300 cursor-pointer text-black'>
        <img src={user?.avatar} className='rounded-full h-10 w-10 mr-2' />
        <p className='text-black font-semibold'>{user.username} </p>
     </div>
    </Link>
    )) : ""}
    </div>
    </div>
    </div>
  )
}

export default ChatsHome