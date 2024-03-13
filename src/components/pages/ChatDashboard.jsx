import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useActive from "../utils/useActive.js"
import {Avatar, Image, Tooltip, useToast} from "@chakra-ui/react"
import axios from "axios"
import { setChats, setSelectedChat } from "../utils/userSlice.js"
import { Box, Button, Stack, Text } from "@chakra-ui/react"
import {AddIcon} from "@chakra-ui/icons"
import ChatLoading from "../misc/ChatLoading.jsx"
import { getSender, getSenderAvatar } from "../utils/chatLogics.js"
import GroupChatModel from "../misc/GroupChatModel.jsx"

function ChatDashboard({ fetchAgain }) {
  const [loggedInUser, setLoggedInUser] = useState('')
  const toast = useToast()
  const dispatch = useDispatch()

  const selectedChat = useSelector(state => state?.chatUser?.selectedChat)
  
  const chats = useSelector(state => state?.chatUser?.chats)

  const fetchChats = async () => {
    try {
      const config = {
        "Content-type": "application/json",
      };
      const { data } = await axios.get("/api/v1/chat", config);
      dispatch(setChats(data?.data))       
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem('loggedInUser')))
    fetchChats()
  }, [fetchAgain])

  return (
     <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
     > 
     <Box
     pb={3}
     px={3}
     fontSize={{ base: "28px", md: "30px" }}
     fontFamily="Lato"
     display="flex"
     w="100%"
     justifyContent="space-between"
     alignItems="center"
     >
      My Chats
    <GroupChatModel>
      <Button
       display="flex"
       fontSize={{ base: "17px", md: "10px", lg: "17px" }}
       rightIcon={<AddIcon />}
      >
        New Group Chat
      </Button>
    </GroupChatModel>
     </Box>

     <Box
     display="flex"
     flexDir="column"
     p={3}
     bg="#F8F8F8"
     w="100%"
     h="100%"
     borderRadius="lg"
     overflowY="hidden"
     >
      {
        chats ? (
          <Stack overflowY='scroll'>
           {
             chats.map(chat => (
              <Box onClick={() => dispatch(setSelectedChat(chat))}
              cursor="pointer"
              bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}>
          
          <Text fontSize={"22px"}>
                  {
                    !chat.isGroupChat ? (
                         getSender(loggedInUser, chat.participants)
                    ) : ( chat.chatName )
                  }
                 </Text>
            </Box>
             ))
           }
          </Stack>
        ) : (
          <ChatLoading/>
        )
      }
     </Box>
     </Box>
  );
}

export default ChatDashboard;
