import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
const ChatsPage = () => {
  let _id = useSelector(state => state.chatUser._id)

  if(!_id){
    _id = localStorage.getItem('userId')
  }

  const [message, setMessage] = useState(null)

  const [conversation, setConversation] = useState([])

  async function sendMessage (){
     const config = {
      headers:{
        "Content-type":"application/json"
      }
     }
     const formData = new FormData()
     formData.append("message", message)
     formData.append("_id", _id)
  try {
      const {data} = await axios.post('/api/v1/chat/chatting', formData, config)
      setConversation(data.data.messages);
  } catch (error) {
     console.log(error); 
  }
}
   
  useEffect(() => {
    sendMessage()
  }, [])

  return (
    <div className="w-1/2 h-screen flex justify-center items-center mx-auto text-gray-200"> 
    <div 
    className="flex flex-col-reverse p-2 gap-2 bg-black h-2/3 max-w-lg mx-auto overflow-auto">
      <div className='flex gap-2'>
        <input type="text" className='text-black p-1 outline-none bg-gray-200' onChange={e => setMessage(e.target.value)} />
        <button type='button' className='bg-gray-200 text-black p-2 hover:bg-slate-300 active:scale-95' onClick={() => {
          sendMessage()
        }}> Send </button>
      </div>

      <div>
        {conversation.map(c => 
          <div className="max-w-lg mx-auto" key={c._id}>
           <div className={c.sender === _id ? "flex justify-end" : "flex justify-start"}>
           <div className={c.sender === _id ? "bg-blue-500 text-white p-2 rounded-lg inline-block whitespace-nowrap overflow-hidden" : "bg-gray-200 text-black p-2 rounded-lg inline-block whitespace-nowrap overflow-hidden"}>
          {c.message}
        </div>
           </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default ChatsPage