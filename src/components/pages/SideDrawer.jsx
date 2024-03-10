import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuItem, MenuList, MenuDivider } from "@chakra-ui/react"
import { useState } from "react"
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import {Avatar} from "@chakra-ui/react"
import ProfileModal from "../misc/ProfileModal"
import { useNavigate } from "react-router-dom"

const SideDrawer = () => {
   const user =  JSON.parse(localStorage.getItem("loggedInUser"))
   const navigate = useNavigate()
   const [searchUsers, setSearchUsers] = useState({
    search:"",
    searchResult:[],
    loading:false,
    loadingChat:""
  })

  const logoutHandler = () => {
    localStorage.removeItem("loggedInUser")
    navigate("/login")
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
          <Button>
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

    </>
)}

export default SideDrawer