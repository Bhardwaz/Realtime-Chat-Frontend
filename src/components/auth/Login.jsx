import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState("")

  const [showPassword, setShowPassword] =  useState(false)
  const navigate = useNavigate()
  async function postData(e){
    e.preventDefault()
    if(!password || !username) return

    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)    

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    try {
    const {data} = await axios.post("/api/v1/users/login", formData, config)
    
    if(data.statusCode === 201){
      navigate('/homepage')
    } 
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-1/2 h-screen flex justify-center items-center mx-auto text-gray-200">
     <form onSubmit={(e) => postData(e)} encType="multipart/form-data" className="flex flex-col gap-2">
     
    <div className="flex gap-4">
    <label htmlFor="username" className="flex items-center"> Username </label>
    <input type="text" id="username" placeholder="Username" onChange={e => setUserName(e.target.value)} className="border p-2 outline-none rounded-lg text-black" />   
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

    <div className="flex items-center justify-start">
    <button type="submit" className="w-2/3 bg-white flex justify-center text-black rounded-lg font-bold ml-12 mt-2 hover:bg-gray-300 hover:scale-95 active:scale-100">
        Submit
    </button>
    </div>
     
    <div>
    <Link to="/"
    className="underline" type="button">
       Do not have a account? Make one !!!
    </Link>
    </div>
     </form>
    </div>
  )
}

export default Login