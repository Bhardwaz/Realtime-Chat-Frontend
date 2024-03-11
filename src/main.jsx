import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import { Provider } from 'react-redux'
import store from './components/utils/store.js'
import SignUp from './components/auth/SignUp.jsx'
import Home from './components/pages/Home.jsx'
import { ChakraProvider } from '@chakra-ui/react'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
      path:"",
      element:<SignUp/>
      },
      {
       path:"/login",
       element:<Login/>
      }, 
      {
       path:"/home",
       element:< Home />
      }, 
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
  <Provider store={store}>
    <RouterProvider router={router} />
    <App />
  </Provider>
  </ChakraProvider>
)
