import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import ChatsPage from './components/pages/ChatsPage.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
      path:"",
      element:<Register/>
      },
      {
       path:"/login",
       element:<Login/>
      }, 
      {
       path:"/chatspage",
       element:< ChatsPage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <App />
  </React.StrictMode>,
)
