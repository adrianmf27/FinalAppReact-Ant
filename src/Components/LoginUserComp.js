/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useCallback } from "react";
import { backendUrl } from "../Globals";
import { useNavigate } from "react-router-dom";
import { emailPattern } from "../Utils";
import { Button, Card, Col, Input, Row } from "antd";

let LoginUserComp = (props) => {
    let {setLogin} = props

    let [name, changeName] = useState(null)
    let [email, changeEmail] = useState(null)
    let [password, changePassword] = useState(null)

    let [message, setMessage] = useState(null)    
    let [error, setError] = useState({})

    let navigate = useNavigate()

    useEffect(() => {
        checkInputErrors()
    }, [name, email, password])

    let checkInputErrors = () => {
        let updatedErrors = {}

         if(name == "" || name?.length < 2){
            updatedErrors.name = "Incorrect name"
        }

        if(email == "" || email?.length < 3 || (email != null && !emailPattern.test(email))){
            updatedErrors.email = "Incorrect email format"
        }

        if(password == "" || password?.length < 5){
            updatedErrors.password = "Incorrect password, maybe too short"
        }

        setError(updatedErrors)
    }

    let changeUserName = (e) => {
        let nameUser = e.currentTarget.value
        changeName(nameUser)
    }

    let changeUserEmail = (e) => {
        let email = e.currentTarget.value
        changeEmail(email)
    }

    let changeUserPass = (e) => {
        let password = e.currentTarget.value
        changePassword(password)
    }

    let clickLoginButton = async (e) => {
        let res = await fetch(backendUrl + "/users/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                name: name,
                email : email,
                password : password
            })
        })

        if (res.ok)
        {
            let jsonData = await res.json()

            if(jsonData.apiKey != null)
            {
                localStorage.setItem("apiKey", jsonData.apiKey)
                localStorage.setItem("userId", jsonData.id)
                localStorage.setItem("email", jsonData.email)
            }            

            setLogin(true)
            navigate("/myPresents")
        }
        else
        {
            let jsonData = await res.json()
            setMessage(jsonData.error)
        }
    }

    return (
        <Row align='middle'justify='center' style={{minHeight: "70vh"}}>
            <Col>
                <Card title='Register' style={{minWidth: '300px', maxWidth: '500px'}}>
                    <Input size="large" type="text" 
                        placeholder="name" onChange={changeUserName}/>
                    <Input size="large" type="text" 
                        placeholder="email" onChange={changeUserEmail}/>
                    <Input style={{marginTop: "10px"}} size="large" type="text" 
                        placeholder="password" onChange={changeUserPass}/>
                        
                    <Button style={{marginTop: "10px"}} type="primary" 
                        onClick={clickLoginButton} block>Log In</Button>
                    </Card>
            </Col>
        </Row>      
    )
}

export default LoginUserComp;