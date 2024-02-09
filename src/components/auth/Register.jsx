import { useState } from "react";

import axios from 'axios'

const Register = () => {
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatar, setAvatar] = useState(null)

  const [showPassword, setShowPassword] = useState(false)

  async function postData(e){
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('avatar', avatar) 
   
    const {data} = await axios.post('/api/v1/users/register', formData, {
      headers:{
        "Content-Type":"multipart/form-data"
      }
    })
    
    console.log(data);
}
  
   return(
    <>
    <form onSubmit={(e) => postData(e)} encType="multipart/form-data">
    <div>
    <label htmlFor="username"> Username </label>
    <input type="text" id="username" placeholder="username" onChange={e => setUserName(e.target.value)} />   
    </div> 

    <div>
    <label htmlFor="email"> Email </label>
    <input type="text" id="email" placeholder="email" onChange={e => setEmail(e.target.value)} />   
    </div> 

    <div>
    <label htmlFor="passsword"> Password </label>
    <input type={showPassword ? 'text' : 'password'} id="passsword" placeholder="Passsword" onChange={e => setPassword(e.target.value)} />   
    </div> 

    <div>
    <label htmlFor="confirmPassword">Confirm Password </label>
    <input type={showPassword ? 'text' : 'password'} id="confirmPassword" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />   
    </div>

    <div>
    <label htmlFor="avatar"> Upload Picture* </label>
    <input type={'file'} id="avatar" name="avatar" placeholder="Avatar" onChange={e => setAvatar(e.target.files[0])} />   
    </div>


    <div>
    <button type="submit">
        Submit
    </button>
    </div>

    <div>
    <button className="underline" type="button">
       Already have a account? Log in!!!
    </button>
    </div>

    </form>      
    </>
   )
}
export default Register