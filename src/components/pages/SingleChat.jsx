import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../utils/userSlice";
import {Box, Text, IconButton, Spinner, FormControl, Input, useToast} from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderObject } from "../utils/chatLogics";
import ProfileModal from "../misc/ProfileModal";
import UpdateGroupChatModal from "../misc/UpdateGroupChatModal";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableChat from "../misc/ScrollableChat";
import Lottie  from "react-lottie"
import animationData from "../../animation/typing.json"
import io from "socket.io-client"
const ENDPOINT = "https://realtime-chat-backend-cynt.onrender.com"
let socket, selectedChatCompare
import { setNotifications } from "../utils/userSlice";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast()
  const [singleChatInfo, setSingleChatInfo] = useState({
       allMessages:[],
       loading:false,
       newMessage:"",
  })

  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)

  const defaultOptions = {
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  let user = useSelector(state => state.chatUser.user)
  if(!user){
   user = JSON.parse(localStorage.getItem('loggedInUser'))
  }
  const selectedChat = useSelector(state => state.chatUser.selectedChat)

  const notifications = useSelector(state => state.chatUser.notifications)

  const dispatch = useDispatch()
  
  const sendMessage = async (e) => {
     if(e.key === "Enter" && singleChatInfo.newMessage){
      socket.emit('stop typing', selectedChat._id)
         try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-type": "application/json"
            },
          };
          
          const { data } = await axios.post("https://realtime-chat-backend-cynt.onrender.com/api/v1/message", {
            content:singleChatInfo.newMessage,
            chatId: selectedChat._id
          }, config);
          
          setSingleChatInfo(prevState => ({...prevState, newMessage: ""}))
           
          socket.emit('new message', data.data)

          if(singleChatInfo?.allMessages?.length > 0){
            setSingleChatInfo(prevState => ({
              ...prevState,
              allMessages: [...prevState.allMessages, data.data]
            }));
          return
          }

          setSingleChatInfo(prevState => ({
            ...prevState,
            allMessages: [data.data]
          }));
         } catch (error) {
          toast({
            title: "Error sending the message",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
         }
     }
  }

  const fetchMessages = async () => {
    if(!selectedChat) return

    setSingleChatInfo(prevState =>({...prevState, loading:true}))

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json"
        },
      };
      const {data} = await axios.get(`https://realtime-chat-backend-cynt.onrender.com/api/v1/message/${selectedChat._id}`, config);
      
      setSingleChatInfo(prevState =>({...prevState, allMessages:data}))

      setSingleChatInfo(prevState =>({...prevState, loading:false}))

      socket.emit('join chat', selectedChat._id)

    } catch (error) {
      toast({
        title: "Error sending the message",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const typingHandler = (e) => {
    setSingleChatInfo(prevState => ({...prevState, newMessage : e.target.value}))

    if(!socketConnected) return
    if(!typing){
    //  setTyping(true)
     socket.emit('typing', selectedChat._id)
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        // setTyping(false);
      }
    }, timerLength);
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on('connected', () => setSocketConnected(true))

    socket.on('typing', () => setTyping(true))
    socket.on('stop typing', () => setTyping(false))

    socket.on('message received', (newMessageReceived) => {
      console.log(newMessageReceived, "new message received");
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id ){
         if(!notifications.includes(newMessageReceived)){
          dispatch(setNotifications([newMessageReceived, ...notifications]))
          setFetchAgain(!fetchAgain)
         }
      }else{
        setSingleChatInfo(prevState => ({...prevState, allMessages:[...prevState.allMessages, newMessageReceived]}))
      }
    })
  }, [])
  
   useEffect(() => {
     fetchMessages()
     selectedChatCompare = selectedChat
   }, [selectedChat])


  return <div> 
    {
      selectedChat ? (
        <>
          <Text
          fontSize={{ base:"28px", md:"30px" }}
          pb={3}
          px={2}
          width={"65vw"}
          fontFamily={"Lato"}
          display='flex'
          justifyContent={{ base: "space-between" }}
          alignItems="center"
          >
          <IconButton
             display={{ base:"flex", md:"none" }}
             icon={<ArrowBackIcon />}
             onClick={() => dispatch(setSelectedChat(""))} 
          />
           {
            !selectedChat.isGroupChat ? ( 
              <> 
                {getSender(user, selectedChat.participants)}
                <ProfileModal user={getSenderObject(user, selectedChat.participants)} />
              </>
            ) : (
              <>{selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                 fetchAgain={fetchAgain}
                 setFetchAgain={setFetchAgain}
                 fetchMessages={fetchMessages}
                />
              </>
            )
           }

          </Text>  
          <Box
          display={'flex'}
          flexDir={'column'}
          justifyContent={'flex-end'}
          p={3}
          bg="#E8E8E8"
          width="100%"
          height="82vh"
          borderRadius={"lg"}
          overflow={"hidden"}
          >
            {
              singleChatInfo.loading ? <Spinner size={"xl"} w={20} h={20} alignSelf={"center"} margin={"auto"} /> : (
                <div className="messages">
                  <ScrollableChat 
                  messages={singleChatInfo.allMessages} />
                </div>
              )
            }
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
          {typing ? <div> <Lottie 
           options={defaultOptions}
           width={70}
           style={{ marginBottom:15, marginLeft:0 }}
          /> </div> : <></>}
            <Input 
            variant={'filled'}
            bg={"#E0E0E0"}
            placeholder="Enter a Message..."
            onChange={typingHandler}
            value={singleChatInfo.newMessage}
            />
          </FormControl>
          </Box>
        </>
      ) : (
        <Box 
        display="flex" height='80vh' alignItems='center' justifyContent='center' 
        >
          <Text fontSize={'3xl'} pb={3} fontFamily='Lato'>
            Click on a chat to start chatting  
          </Text>
        </Box>
      )
    }   
  </div>;
};

export default SingleChat;
