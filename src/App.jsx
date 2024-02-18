import { Outlet } from 'react-router-dom'
import Register from './components/auth/Register'
import ChatPage from './components/pages/ChatsPage'

function App() {
  return (
    <>
    <Outlet>
    <Register/>
    <ChatPage/>
    </Outlet>
    </>
  )
}

export default App
