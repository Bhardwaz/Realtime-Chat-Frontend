import { Outlet } from 'react-router-dom'
import Register from './components/auth/Register'
import ChatsPage from './components/pages/ChatsPage'

function App() {
  return (
    <>
    <Outlet>
    <Register/>
    </Outlet>
    </>
  )
}

export default App
