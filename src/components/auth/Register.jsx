import { useState } from "react";
import {Link} from "react-router-dom"
import axios from 'axios'

const Register = () => {
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState(null)

  const [showPassword, setShowPassword] = useState(false)
  const [response, setResponse] = useState(null) 

  async function postData(e){
    e.preventDefault()
    if(password !== confirmPassword){
      setResponse("Password and Confirm Password must match")
      return
    }
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('avatar', avatar) 
   
    try {
      const {data} = await axios.post('/api/v1/users/register', formData, {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })
      
      setResponse(data.message)
    } catch (error) {
      console.log(error.response.data.data, "into catch block");
      setResponse(error.response.data.data)
    }
}
  
   return(
    <div className="w-1/2 h-screen flex justify-center items-center mx-auto text-gray-200">
    <form onSubmit={(e) => postData(e)} encType="multipart/form-data" className="flex flex-col gap-2 ">

    <div className="flex gap-4">
    <label htmlFor="username" className="flex items-center"> Username </label>
    <input type="text" id="username" placeholder="Username" onChange={e => setUserName(e.target.value)} className="border p-2 outline-none rounded-lg text-black" />   
    </div> 

    <div className="flex gap-12">
    <label htmlFor="email" className="flex items-center"> Email </label>
    <input type="text" id="email" placeholder="Email" onChange={e => setEmail(e.target.value)} className="border p-2 outline-none rounded-lg text-black" />   
    </div> 

    <div className="flex gap-5">
    <label htmlFor="passsword" className="flex items-center"> Password </label>
    <input type={showPassword ? 'text' : 'password'} id="passsword" placeholder="Passsword" onChange={e => setPassword(e.target.value)} className="border p-2 outline-none rounded-lg text-black" /> 
    <button
        type="button"
        className="border p-2 rounded-lg"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>  
    </div>  

    <div>
    <label htmlFor="confirmPassword">C Password </label>
    <input type={showPassword ? 'text' : 'password'} id="confirmPassword" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} className="border p-2 outline-none rounded-lg text-black" />   
    </div>
      
    <div className="text-red-300">
     {response}
    </div>

    <div>
    <label htmlFor="avatar"> Upload Picture* </label>
    <input type={'file'} id="avatar" name="avatar" placeholder="Avatar" onChange={e => setAvatar(e.target.files[0])} className="rounded-lg" />   
    </div>

    <div className="flex items-center justify-start">
    <button type="submit" className="w-2/3 bg-white flex justify-center text-black rounded-lg font-bold ml-2 hover:bg-gray-300 hover:scale-95 active:scale-100">
        Submit
    </button>
    </div>

    <div>
    <Link to="/login"
    className="underline" type="button">
       Already have a account? Log in!!!
    </Link>
    </div>

    </form>      
    </div>
   )
}
export default Register