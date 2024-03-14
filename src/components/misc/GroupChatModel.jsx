import {useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Input, Box, ModalFooter, Button, useToast} from "@chakra-ui/react"
import UserListItem from './UserListItem'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setChats } from "../utils/userSlice"
import axios from "axios"
import UserBadgeItem from "./UserBadgeItem"
import ChatLoading from "../misc/ChatLoading"

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const dispatch = useDispatch()
  const [groupChatInfo, setGroupChatInfo] = useState({
    name:"",
    participants:[],
    search:"",
    searchResult:[],
    loading:false
  })

   const user  = useSelector(state => state.chatUser.user)
   const chats = useSelector(state => state.chatUser.chats)
   
   const handleChange = (event) => {
    const {name, value} = event.target
    setGroupChatInfo({...groupChatInfo, [name]:value})
   }

   const handleSearch = async (query) => {
    if(!query){
        return
    }
    setGroupChatInfo(prevState => ({ ...prevState, search: query }));
    
    try {
        setGroupChatInfo(prevState => ({ ...prevState, loading: true }));  
        const config = {
            "Content-type":"application/json"
        }
        const { data } = await axios.get(`https://chat-backend-2-7hsy.onrender.com/api/v1/users/searchUser?searchUser=${groupChatInfo.search}`, config);


        setGroupChatInfo(prevState => ({ ...prevState, loading: false }));

        setGroupChatInfo(prevState => ({ ...prevState, searchResult: data }));

    } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
    }

   }
  
   const handleRemove = (userToRemove) => {
    const updatedUsers = groupChatInfo?.participants?.filter(user => user._id !== userToRemove._id)
  
    setGroupChatInfo(prevState => ({ ...prevState, participants:[...updatedUsers] }))
   }

   const handleGroup = (participantToAdd) => {
       if(groupChatInfo.participants.includes(participantToAdd)){
        toast({
            title: "Participant is already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          })}
    else{
        setGroupChatInfo(prevState => ({...prevState, 
            participants: [...prevState.participants, participantToAdd] }))
    }
   }

  const handleSubmit = async () => {
     if(!groupChatInfo.name || !groupChatInfo.participants){
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
    })
  }
  try {
    const config = {
      "Content-type":"application/json"
    }

    const { data } = await axios.post('https://chat-backend-2-7hsy.onrender.com/api/v1/chat/creategroup',{ 
     name:groupChatInfo.name,
     participants:JSON.stringify(groupChatInfo.participants.map(p => p._id))
    }, config);
    

    dispatch(setChats([data.data, ...chats]))
    onClose()
    toast({
      title: "New Group Chat Created",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
  })
  } catch (error) {
    toast({
      title: "Failed to create chat",
      description: error.response.data,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
  })
  }
  } 
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Lato"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                name="name"
                placeholder="Chat Name"
                mb={3}
                onChange={event => handleChange(event)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Participants eg: Sumit"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box width="100%" display="flex" flexWrap="wrap">
              { groupChatInfo.participants.map(user => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            {groupChatInfo.loading ? (
              <ChatLoading />
            ) : (
              groupChatInfo.searchResult?.data   
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
            ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModel