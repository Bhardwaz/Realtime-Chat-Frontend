import { useEffect, useState } from "react"
import axios from "axios"
import { selectedFriendToChat } from "../utils/userSlice.js"
import { useDispatch, useSelector } from "react-redux"
import useActive from "../utils/useActive.js"
import { fetchChats } from "../utils/getChatsSlice.js"

function ChatDashboard() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let timerId;
  const [search, setSearch] = useState('');
  const [gotUsers, setGotUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState('');
  const [chats, setChats] = useState([]);
  const active = useActive();
   
  const state = useSelector(state => state.chatSlice);
  console.log(state);

  const debounce = (func, delay) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay);
  }
  
  async function makeApiRequest() {
    try {
      const config = {
        "Content-type": "application/json"
      };
      const { data } = await axios.get(`/api/v1/users/searchUser?searchUser=${search}`, config);
      setGotUsers(data?.data);
    } catch (error) {
       console.log(error); 
    }
  }

  function createChat() {
    const config = {
      "Content-type": "application/json"
    };
    try {
      const accessChat = axios.post("/api/v1/chat", {
        _id: selectedChat
      }, config);

      const fetchChats = axios.get("/api/v1/chat");
      
      Promise.all([accessChat, fetchChats])
        .then(responses => {
          console.log(responses);
        });
    } catch (error) {
      console.log(error);
    }
  }
   
  useEffect(() => {
    if (!search) return setGotUsers([]);
    try {
      debounce(makeApiRequest, 2000);
    } catch (error) {
      console.log(error);
    }
  }, [search]);
     
  useEffect(() => {
    dispatch(fetchChats());  
  }, [dispatch]);
  
  useEffect(() => {
    setChats(state?.data?.data?.data);
  }, [state]);
   
  console.log(chats, 'chats');
  return (
    <div className="lg:w-[18%] bg-[#F9F9F9]">
      <div className="w-full h-[15%] flex gap-4 p-4 items-center">
         <div className="w-16 h-16 rounded-full overflow-hidden">
           <img
           src={user?.avatar}
           alt="avatar"
           className="w-full h-full object-cover"/>
         </div>

        <div className="flex items-center">
          <p className="text-[#4883FB] font-semibold text-lg mt-2">{user?.username} <span className={`inline-block w-2 h-2 ${active ? "bg-green-500" : "bg-red-700"} rounded-full mr-2 mt-2`}></span> </p> 
        </div>
      </div>

      <div className="ml-2">
        <input
          type="text"
          className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Search Friends"
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Chats */}
      <div className="overflow-y-auto max-h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-blue-500 text-blue-500 scrollbar-track-blue-200 hover:text-black">
        { chats?.length > 0 ? chats.map(chat => (
          <div 
            key={chat._id} 
            className="lg:w-full items-center flex gap-2 border m-1 cursor-pointer hover:bg-blue-500 p-2 rounded-lg">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={chat?.avatar}
                alt="avatar"
                className="w-full h-full object-cover"/>
            </div>
            <p>{chat?.chatName}</p>
          </div>
        )) : null }
        
        { gotUsers.length ? <p className="p-3"> {gotUsers.length} Results Found </p> : " "}
        { gotUsers ? gotUsers.map(user => (
          <div 
            onClick={() => {
              dispatch(selectedFriendToChat(user));
              setSelectedChat(user._id);
              createChat();
            }} 
            key={user._id} 
            className="lg:w-full items-center flex gap-2 border m-1 cursor-pointer hover:bg-blue-500 p-2 rounded-lg">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={user?.avatar}
                alt="avatar"
                className="w-full h-full object-cover"/>
            </div>
            <p>{user?.username}</p>
          </div>
        )) : null }
      </div>
    </div>
  );
}

export default ChatDashboard;
