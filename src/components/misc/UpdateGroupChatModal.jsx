import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner
  } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedChat, setUser } from '../utils/userSlice'
import { useState } from 'react'
import UserBadgeItem from './UserBadgeItem'
import axios from 'axios'
import UserListItem from './UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch()
  const selectedChat = useSelector(state => state.chatUser.selectedChat)
  
  let user = useSelector(state => state.chatUser.user)
  if(!user){
    user = JSON.parse(localStorage.getItem('loggedInUser'))
   }
  const toast = useToast() 

  const [groupChatActions, setGroupChatActions] = useState({
    groupChatName:"",
    search:"",
    searchResult:[],
    loading:false,
    renameLoading:false
  })

  const handleChange = (event) => {
    const {name, value} = event.target
    setGroupChatActions({
      ...groupChatActions,
      [name]:value 
    })
  }

  const handleRename = async () => {
    if(!groupChatActions.groupChatName) return

    try {
        setGroupChatActions(prevState => ({...prevState, renameLoading:true}))

        const config = {
         "Content-type":"application/json"
        }
        
        const {data} = await axios.put("/api/v1/chat/changename", {
            groupId:selectedChat._id,
            name:groupChatActions.groupChatName
        }, config)

        dispatch(setSelectedChat(data.data))
        setFetchAgain(!fetchAgain)

        setGroupChatActions(prevState => ({...prevState, renameLoading:false}))
    } catch (error) {
         toast({
            title:"Error Occured!",
            description:error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
         })
         setGroupChatActions(prevState => ({...prevState, renameLoading:false}))
    }
    setGroupChatActions(prevState => ({...prevState, groupChatName:""}))
  }

  const handleSearch = async (query) => {
    if(!query){
        return
    }
    setGroupChatActions(prevState => ({ ...prevState, search: query }));
    
    try {
        setGroupChatActions(prevState => ({ ...prevState, loading: true }));  
        const config = {
            "Content-type":"application/json"
        }
        const { data } = await axios.get(`/api/v1/users/searchUser?searchUser=${groupChatActions.search}`, config)

        console.log(data);

        setGroupChatActions(prevState => ({ ...prevState, loading: false }));

        setGroupChatActions(prevState => ({ ...prevState, searchResult: data.data }));

    } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
    }}

   const handleAdd = async (user1) => {
        if(selectedChat.participants.find(u => u._id === user1._id)){
            toast({
                title:'User Already in group',
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
        return
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title:'Only Admin can add someone',
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
        return
        }
      
    try {
        setGroupChatActions(prevState => ({...prevState, loading:true}))

        const config = {
            "Content-type":"application/json"
        }

        const { data } = await axios.put("/api/v1/chat/groupadd", {
            groupId: selectedChat._id,
            participantId: user1._id
        }, config)

        dispatch(setSelectedChat(data.data))
        setFetchAgain(!fetchAgain)
        setGroupChatActions(prevState => ({...prevState, loading:false}))
    } catch (error) {
        toast({
            title:'Error occured while adding',
            description:error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        })
    }
   }
   
   const handleRemove = async (user1) => {
    console.log(user1);
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast({
            title:'Only Admin can remove someone',
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        })
    return
    }

    try {
        setGroupChatActions(prevState => ({...prevState, loading:true}))

        const config = {
            "Content-type":"application/json"
        }

        const {data} = await axios.put("/api/v1/chat/groupremove", {
            groupId: selectedChat._id,
            participantId: user1._id
        }, config)

        user1._id === user._id ? dispatch(setSelectedChat("")) : dispatch(setSelectedChat(data.data))

        setFetchAgain(!fetchAgain)
        fetchMessages()
        setGroupChatActions(prevState => ({...prevState, loading:false}))
    } catch (error) {
        toast({
            title:'Error Occured',
            description:error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        })
    }

   }

  return (
    <>
      <IconButton display={{ base:"flex" }} icon={<ViewIcon/>} onClick={onOpen}>Open Modal</IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize={"35px"}
          fontFamily={"Lato"}
          display={"flex"}
          justifyContent={"center"}
          > {selectedChat.chatName} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
             <Box
             width="100%" display={"flex"} flexWrap={"wrap"} pb={3}
             >
            {
                selectedChat.participants.map(p => 
                    <UserBadgeItem
                        key={p._id}
                        user={p}
                        handleFunction={() => handleRemove(p)}
                    />
                )
                }
             </Box>
          <FormControl display={"flex"}>
             <Input
             name="groupChatName"
             placeholder="Chat Name"
             mb={3}
             value={groupChatActions.groupChatName}
             onChange={(e) => handleChange(e)}
             />
             <Button
             variant={"solid"}
             colorScheme='teal'
             ml={"1"}
             isLoading={groupChatActions.renameLoading}
             onClick={() => handleRename()}
             >
                Update
             </Button>
          </FormControl>
           
          <FormControl>
            <Input 
             placeholder='Add User to group'
             mb={1}
             onChange={e => handleSearch(e.target.value)}
            />

          </FormControl>
             
             {
                groupChatActions.loading ? (
                 <Spinner size={'lg'} />
                ) : (
                groupChatActions.searchResult.length > 0 &&  groupChatActions.searchResult.map(user => {
                return <UserListItem
                     key={user._id}
                     user={user}
                     handleFunction={() => handleAdd(user)}
                    />
                })
                )
             }

          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme='red' mr={3}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal