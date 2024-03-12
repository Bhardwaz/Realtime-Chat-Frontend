import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuItem, MenuList, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerHeader, DrawerContent, DrawerBody, Input, useToast, Spinner } from "@chakra-ui/react"
import { useState } from "react"
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import {Avatar} from "@chakra-ui/react"
import ProfileModal from "../misc/ProfileModal"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import ChatLoading from "../misc/ChatLoading"
import UserListItem from "../misc/UserListItem"
import { useDispatch, useSelector } from "react-redux"
import { setChats, setSelectedChat } from "../utils/userSlice"

const SideDrawer = () => {
   const user =  JSON.parse(localStorage.getItem("loggedInUser"))
   const navigate = useNavigate()
   const toast = useToast()
   const dispatch = useDispatch()
   const { isOpen, onOpen, onClose } = useDisclosure()

   const [searchUsers, setSearchUsers] = useState({
    search:"",
    searchResult:[],
    loading:false,
    loadingChat:false
  })

  const chats = useSelector(state => state.chatUser.chats)
  
  const logoutHandler = () => {
    localStorage.removeItem("loggedInUser")
    navigate("/login")
  }

  const handleChange = (event) => {
    const {name, value} = event.target
    setSearchUsers({
      ...searchUsers,
      [name]:value 
    })
  }

  const handleSearch = async () => {
    if(!searchUsers.search){
        toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
        })
    return
    }
    try {
        setSearchUsers(prevState => ({ ...prevState, loading: true }));
  
        const config = {
            "Content-type": "application/json"
        };
  
        const { data } = await axios.get(`/api/v1/users/searchUser?searchUser=${searchUsers.search}`, config);
  
        setSearchUsers(prevState => ({ ...prevState, loading: false }));

        setSearchUsers(prevState => ({ ...prevState, searchResult : data?.data }));

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

  const accessChat = async (_id) => {
    try {
     setSearchUsers(prevState => ({ ...prevState, loadingChat: true }));   

     const config = {
        "Content-type": "application/json"
    };

    const { data } = await axios.post('/api/v1/chat', {
        _id
    }, config)
    if(!chats?.find(chat => chat._id === data._id)) dispatch(setChats([data?.data, ...chats]))

    dispatch(setSelectedChat(data?.data))
    
    setSearchUsers(prevState => ({ ...prevState, loadingChat:false }));

    onClose()
    } catch (error) {
        toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
    }
  }
  
  return (
    <>
    <Box
     display="flex"
     justifyContent="space-between"
     alignItems="center"
     bg="#00A884"
     w="100%"
     p="5px 10px 5px 10px"
     borderWidth="5px" 
    >
       <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button onClick={onOpen}>
          <i className="fas fa-search"></i>
          <Text d={{base:"none", md:"flex"}} px='4'>  
            Search User 
          </Text>
          </Button>
       </Tooltip>

       <Text fontSize="2xl" fontFamily="Lato" color="#F0F2F5">
          Messenger
        </Text>

    <div>
     <Menu>
      <MenuButton p={1}>
         <BellIcon color='wheat' fontSize={"2xl"} />
      </MenuButton>
      {/* {<MenuList></MenuList>} */}
     </Menu>

     <Menu>
      <MenuButton 
      as={Button} 
      rightIcon={<ChevronDownIcon/>}  >
      <Avatar size={"sm"} cursor="pointer" name={user?.username} src={user.avatar} />
      </MenuButton>

      <MenuList> 
       <ProfileModal user={user}>
          <MenuItem> My Profile </MenuItem>  
       </ProfileModal>
       <MenuDivider />  
       <MenuItem onClick={logoutHandler}> Logout </MenuItem>    
      </MenuList>
     </Menu>
    
    </div>
    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent> 
        <DrawerHeader borderBottomWidth="1px"> 
        Search Users  
        </DrawerHeader>
        <DrawerBody>
        <Box display={"flex"} pb="2">
           <Input
            name="search"
            placeholder="Search by name or email"
            mr={2}
            value={searchUsers?.search}
            onChange={(event) => handleChange(event)}
           />
           <Button onClick={handleSearch}> Go </Button>
        </Box>
        {
           searchUsers.loading ? <ChatLoading /> : 
            searchUsers.searchResult?.map(user => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
            ))
        }
      { searchUsers.loadingChat && <Spinner ml='auto' d='flex' /> }
      </DrawerBody>
      </DrawerContent>
    </Drawer>
    </>
)}

export default SideDrawer