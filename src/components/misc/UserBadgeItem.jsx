import {Box} from '@chakra-ui/react'
import { CloseIcon } from "@chakra-ui/icons"
const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    marginBottom={1}
    variant="solid"
    fontSize={12}
    color="white"
    backgroundColor="purple"
    cursor="pointer"
    onClick={handleFunction}
    display='inline'
    > 
     {user.username}
      {/* {admin === user._id && <span> (Admin)</span>} */}
    <CloseIcon pl={1} />
    </Box>
  )
}

export default UserBadgeItem