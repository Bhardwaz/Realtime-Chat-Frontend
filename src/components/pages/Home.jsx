import { useEffect, useState } from "react"
import ChatDashboard from "./ChatDashboard"
import ChatRoom from "./ChatRoom"
import { useNavigate } from "react-router-dom"
import { Box } from "@chakra-ui/react"
import SideDrawer from "./SideDrawer"

function Home() {
  const navigate = useNavigate()
  const user =  JSON.parse(localStorage.getItem("loggedInUser"))
  const [fetchAgain, setFetchAgain] = useState(false)
  
  useEffect(() => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))

  if(!loggedInUser){
   navigate('/login')
  }
  }, [navigate])

  return (
    <div style={{width:"100%", backgroundColor:"#F0F2F5"}}>
      { user && <SideDrawer/> }
      <Box
      style={{borderRadius:"10px"}}
      display="flex"
      justifyContent="space-between"
      width="100%"
      height="96.5vh"
      p="10px"
      >
      {user && <ChatDashboard fetchAgain={fetchAgain} /> }
      { user && <ChatRoom fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> }
      </Box>
    </div>
  )
}

export default Home