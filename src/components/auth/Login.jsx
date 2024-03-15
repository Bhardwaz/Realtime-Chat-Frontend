import axios from "axios"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {useDispatch} from 'react-redux'
import { setUser } from "../utils/userSlice"

const Login = () => {
  const [userData, setUserData] = useState({
    username:"", 
    password:""
  })
  
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] =  useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')

  const navigate = useNavigate()
  async function postData(e){
    e.preventDefault()
    setIsLoading(true)
    if(!userData.password || !userData.username) return

    const formData = new FormData()
    formData.append('username', userData.username)
    formData.append('password', userData.password)    

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    
    try {
    const { data } = await axios.post("https://realtime-chat-backend-cynt.onrender.com/api/v1/users/login", formData, config);

    setIsLoading(false);
    console.log(data, "data"); 
    const loggedInUser = JSON.stringify(data)
    const loggedInId = data?._id
    if(loggedInUser){
    console.log(loggedInUser);
    localStorage.setItem("loggedInUser", loggedInUser)
    localStorage.setItem("loggedInId", loggedInId)
    dispatch(setUser(data))
    navigate('/home')
    }
    } catch (error) {
      console.log(error?.response?.data?.data);
      setShowResponse(true)
      setResponseMessage(error?.response?.data?.data)
      setIsLoading(false)
    }
  }
   
  const handleChange = event => {
    const {name, value} = event.target
    setUserData({
      ...userData,
      [name]:value
    })
  }

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    const loggedInId = localStorage.getItem("loggedInId")
    if(loggedInUser?._id === loggedInId) navigate("/home")
    }, [navigate])

  return (
    <>
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <img className="mx-auto h-10 w-auto" src="https://cdn-icons-png.flaticon.com/512/10948/10948696.png" alt=""/>
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form onSubmit={postData} className="space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium leading-6 text-white"> Username </label>
        <div className="mt-2">
          <input id="username" placeholder="Username" name="username" type="username" autoComplete="username" required
          onChange={handleChange}
          value={userData.username}
          className="bg-gray-300  block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 outline-none"/>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password</label>
          <div className="text-sm">
            <button onClick={() => setShowPassword(!showPassword)} type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">Show</button>
          </div>
        </div>
        <div className="mt-2">
          <input id="password" 
          placeholder="Password" 
          name="password" 
          type={`${showPassword ? "text" : "password"}`} autoComplete="current-password" 
          required 
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-black bg-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 outline-none"/>
        </div>
      </div>

      <div className="text-red-500">
         { showResponse ? responseMessage : ""}
      </div>

      <div>
        <button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{ isLoading ? "Wait" : "Login" }</button>
      </div>
    </form>

    <p className="mt-10 text-center text-sm text-white">
      Not a member?
      <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Register here  </Link>
    </p>
  </div>
</div>
    </>

  )
}

export default Login