/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { emailPattern } from "../Utils"
import { backendUrl } from "../Globals"
import { Button, Card, Col, Input, Row, Typography, Alert} from "antd";

let CreateUserComp = (props) => {
    let {createNotification} = props

    let [name, changeName] = useState(null)
    let [email, changeEmail] = useState(null)
    let [password, changePassword] = useState(null)

    let [error, setError] = useState({})
    let [message, setMessage] = useState(null)

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

    let clickCreate = async (e) => {
        let res = await fetch(backendUrl + "/users", {
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
            createNotification("success", "User created succesfully")
            navigate("/login")
        }
        else
        {
            let jsonData = await res.json()
            let finalErrorMsg = ""

            if(Array.isArray(jsonData.errors))
            {
                jsonData.errors.forEach(element => { finalErrorMsg += element.error + " " });
                setMessage(finalErrorMsg)
            }
            else 
            {
                setMessage(jsonData.errors)
            }
        }
    }

    let {Text} = Typography

    return (
        <Row align='middle'justify='center' style={{minHeight: "70vh"}}>
            {message != null && <Alert type="error" message={ message }/>}

            <Col>
                <Card title='Register' style={{minWidth: '300px', maxWidth: '500px'}}>
                    <Input size="large" type="text" 
                            placeholder="name" onChange={changeUserName}/>
                    {error.name && <Text type="danger">{error.name}</Text>}
                    <Input style={{marginTop: "10px"}} size="large" type="text" 
                            placeholder="email" onChange={changeUserEmail}/>
                    {error.email && <Text type="danger">{error.email}</Text>}
                    <Input style={{marginTop: "10px"}} size="large" type="text" 
                            placeholder="password" onChange={changeUserPass}/>
                    {error.password && <Text type="danger">{error.password}</Text>}
                    
                    <Button style={{marginTop: "10px"}} type="primary" 
                        onClick={clickCreate} block>Create account</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreateUserComp;