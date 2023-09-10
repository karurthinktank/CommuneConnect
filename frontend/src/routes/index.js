import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"
import EditProfile from "pages/Authentication/Edit-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

// Case
import UsersListTable from "pages/Users/ListCase"
import AddUser from "pages/Users/AddUser"
import EditCase from "pages/Users/EditCase"
import Summary from "pages/Users/Add-Summary"
import ListSummary from "pages/Users/List-Summary"
import ViewCase from "pages/Users/ViewCase"


const authProtectedRoutes = [
  { path: "/home", component: <Dashboard/> },
  {path:"/users-list", component:<UsersListTable/>},
  {path:"/cases-view/:id", component:<ViewCase/>},
  {path:"/cases-edit/:id", component:<EditCase/>},
  {path:"/user-add", component:<AddUser/>},
  {path:"/case/:id/summary-list", component:<ListSummary/>},
  {path:"/case/:id/summary-add", component:<Summary/>},


  // //profile
  { path: "/profile", component: <UserProfile/> },
  {path:"/edit-profile", component:<EditProfile/>},

  //Org
  

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
   {
    path: "/",
    exact: true,
    component: < Navigate to="/home" />,
  },

   /* 👇️ only match this when no other routes match */
   {
    path: "*", 
    exact: true,
    component: < Navigate to="/home" />
  } 
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }

