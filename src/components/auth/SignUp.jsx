import { useEffect, useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import * as Yup from "yup"
import axios from 'axios'
export default function SignUp() {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
      username:"",
      email:"",
      password:"",
      confirmPassword:"",
      avatar:"" 
     })
    const [errors, setErrors] = useState({})
     
    const validationSchema = Yup.object({
    username:Yup.string().required("Username is required"),
    email:Yup.string()
      .email("Invalid Email")
      .required("Email is required"),      
    password:Yup.string().required("Password is required")
      .min(8, "Password must be atleast of 8 Characters"),
    confirmPassword:Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Please Confirm Password")
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showResponse, setShowResponse] = useState(false)
    const [responseMessage, setResponseMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async event => {
      event.preventDefault()
      setIsLoading(true)
      try {
      await validationSchema.validate(userData, {abortEarly:false})
       
      const formData = new FormData()
      formData.append("username", userData.username)
      formData.append("email", userData.email)
      formData.append("password", userData.password)
      formData.append("avatar", userData.avatar)
      
      const { data } = await axios.post('https://realtime-chat-backend-cynt.onrender.com/api/v1/users/register', formData, {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })
      console.log(data);
      setShowResponse(true)
      setResponseMessage(`${data.data.username} ${data.message}`)
      setIsLoading(false)
      console.log(data);
      navigate('/login')
      } catch (error) {
        if(!error.response){
        const newError = {}
        console.log(error);
        error.inner.forEach((err) => {
          newError[err.path] = err.message
        })
        setErrors(newError)
      }
    console.log(error, "error");
    setShowResponse(true)
    setResponseMessage(error?.response?.data?.data)
    setIsLoading(false)
    }
    }
    
    const handlePic = (event) => {
      const {name, files} = event.target
      setUserData({
        ...userData,
        [name]:files[0]
      })
    }

    const handleChange = (event) => {
      const {name, value} = event.target
      setUserData({
        ...userData,
        [name]:value 
      })
    }
    
    useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    if(loggedInUser) navigate("/home")
    }, [navigate])

     return (
      <div className="bg-black h-[100vh] w-[100vw]">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://cdn-icons-png.flaticon.com/512/10948/10948696.png"
              alt="Pigeon"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Sign up for an account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-3" onSubmit={event => handleSubmit(event)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter Your Email"
                    required
                    className="bg-gray-300 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2 outline-none"
                    onChange={handleChange}
                    value={userData.email}
                  />
                </div>
              </div>
          {errors.email && <div className="text-red-600">
          {errors.email}
          </div>}
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter Your Username"
                    required
                    className="bg-gray-300 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2 outline-none"
                    onChange={handleChange}
                    value={userData.username}
                  />
                </div>
            {errors.username && <div className="text-red-600">
          {errors.username}
          </div>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type={`${showPassword ? 'text' : 'password'}`}
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                    className="bg-gray-300 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pr-10 pl-2 outline-none"
                    onChange={handleChange}
                    value={userData.password}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onClick={() => {setShowPassword(!showPassword)}}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 12a2 2 0 113.999-.001A2 2 0 017 12z"
                      />
                    </svg>
                  </button>
                </div>
          {errors.password && <div className="text-red-600">
          {errors.password}
          </div>}
              </div>
  
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-white">
                  Confirm Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={`${showPassword ? 'text' : 'password'}`}
                    autoComplete="current-password"
                    required
                    placeholder="Confirm Password"
                    className="bg-gray-300 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pr-10 pl-2 outline-none"
                    onChange={handleChange}
                    
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onClick={() => {setShowPassword(!showPassword)}}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 12a2 2 0 113.999-.001A2 2 0 017 12z"
                      />
                    </svg>
                  </button>
                </div>
          {errors.confirmPassword && <div className="text-red-600">
          {errors.confirmPassword}
          </div>}
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-medium leading-6 text-white">
                  Choose avatar
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <input
                    id="avatar"
                    name="avatar"
                    type='file'
                    accept="image/*"
                    className="bg-gray-300 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pr-10 pl-2 outline-none"
                    onChange={handlePic}
                  />
                </div>
              </div>
          
          { showResponse && <div className="p-4 shadow-sm mt-4 text-base text-red-700">{responseMessage}</div> }

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${
                    isLoading ? 'bg-gray-500' : 'bg-indigo-600'
                  } flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                { isLoading ? "Adding you in database" : "Sign Up"  }
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  