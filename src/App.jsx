import { Outlet } from 'react-router-dom'
import SignUp from './components/auth/SignUp'
import Home from './components/pages/Home'

function App() {
  return (
    <>
    <Outlet>
    <SignUp/>
    <Home/>
    </Outlet>
    </>
  )
}

export default App
