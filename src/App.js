/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-comment-textnodes */
import './App.css';
import 'antd/dist/reset.css'
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import CreateUserComp from './Components/CreateUserComp';
import LoginUserComp from './Components/LoginUserComp';
import React, { useEffect, useState } from 'react';
import { backendUrl } from './Globals';
import CreatePresentComp from './Components/CreatePresentComp';
import MyPresentsComp from './Components/MyPresentsComp';
import EditPresentComp from './Components/EditPresentComp';
import AddFriendComp from './Components/AddFriendComp';
import MyFriendsComp from './Components/MyFriendsComp';
import GivePresentComp from './Components/GivePresentComp';
import { Layout, Menu, message, notification } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';

function App() {
  let [api, contextHolder] = notification.useNotification()
  let [login, setLogin] = useState(false)

  let navigate = useNavigate()

  useEffect(() => {
    navigate("/")
    //setLogin(false)
  }, [])  
  
  let createNotif = (type = "info", msg, placement = "top") => {
      api[type]({
        message: msg,
        description: msg,
        placement
      })
  }

  let disconnect = async () => {
    await fetch(backendUrl + "/users/disconnect?apiKey=" + localStorage.getItem("apiKey"))
    localStorage.removeItem("apiKey")
    setLogin(false)
    navigate("/login")
  }

  return (
    <>
      {contextHolder}

      <Layout className='layout' style={{minHeight: '100vh'}}>
        <Header>
          {!login && (
              <Menu mode='horizontal' theme='dark' items={[
                {key: "menuRegister", label: <Link to="/register">Register</Link>},
                {key: "menuLogin", label: <Link to="/login">Log In</Link>}
              ]}></Menu>)}

            {login && (
            <Menu mode='horizontal' theme='dark' items= {[
              {key: "menuPresents", label: <Link to="/presents">Create Present</Link>},
              {key: "menuMyPresents", label: <Link to="/myPresents">My Presents</Link>},
              {key: "menuAddFriend", label: <Link to="/addFriend">Add friend</Link>},      
              {key: "menuMyFriends", label: <Link to="/myFriends">My friends</Link>},    
              {key: "menuGivePresent", label: <Link to="/givePresent">Give present!</Link>},  
              {key: "menuDisconnect", label: <Link to="#" onClick={disconnect}>Disconnect</Link>}]}>
            </Menu>)}
        </Header>

        <Content style={{padding: "20px 50px"}}>
            <Routes>
              <Route path="/" element={<p>Index of website</p>}/>
              <Route path="/register" element={<CreateUserComp createNotification={createNotif}/>}/>
              <Route path="/login" element={<LoginUserComp setLogin={setLogin}/>}/>
              <Route path="/presents" element={<CreatePresentComp createNotification={createNotif} />}/>
              <Route path="/myPresents" element={<MyPresentsComp createNotification={createNotif} />}/>
              <Route path="/edit/:presentId" element={<EditPresentComp createNotification={createNotif} />}/>
              <Route path="/addFriend" element={<AddFriendComp createNotification={createNotif} />}/>
              <Route path="/myFriends" element={<MyFriendsComp createNotification={createNotif} />}/>
              <Route path="/givePresent" element={<GivePresentComp createNotification={createNotif} />}/>
          </Routes>
        </Content>

        <Footer style={{textAlign: 'center'}}> My website </Footer>
      </Layout>
    </>
  )
}

export default App;