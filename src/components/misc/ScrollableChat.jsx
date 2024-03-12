import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender } from "../utils/chatLogics"
import { useSelector } from "react-redux"
import { Avatar, Tooltip } from "@chakra-ui/react"

const ScrollableChat = ({ messages }) => {
  let user = useSelector(state => state.chatUser.user)
  if(!user){
   user = JSON.parse(localStorage.getItem("loggedInUser"))
  }
  console.log(messages, "messages");
  console.log(user, "user");
  return (
    <ScrollableFeed>
        {
        messages && messages.map((m, i) => {
        return <div  style={{display:"flex"}} key={m._id}> 
        {
          (isSameSender(messages, m, i, user._id)) || isLastMessage(messages, i, user._id ) && (
            <Tooltip 
            label={m.sender.username}
            placement="bottom-start"
            hasArrow
            >
            <Avatar
            mt={"7px"}
            mr={1}
            size={"sm"}
            cursor={"pointer"}
            name={m.sender.username}
            src={m.sender.avatar}
            />
            </Tooltip>
          ) 
        }          
        </div>
        })
        }
    </ScrollableFeed>
  )
}

export default ScrollableChat