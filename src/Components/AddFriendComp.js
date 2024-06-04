/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { backendUrl } from "../Globals"
import { useNavigate } from "react-router-dom"
import { emailPattern } from "../Utils"
import { Alert, Button, Card, Col, Input, Row, Typography } from "antd"


let AddFriendComp = (props) => {
    let {createNotification} = props
    let [emailFriend, changeEmailFriend] = useState(null)
    let [listIdentifier, changeListIdentifier] = useState(null)
    
    let [error, setError] = useState({})
    let [message, setMessage] = useState(null)

    let navigate = useNavigate()

    useEffect(() => {
        checkInputErrors()
    }, [emailFriend])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if(emailFriend == "" || emailFriend?.length < 3 
            || (emailFriend != null && !emailPattern.test(emailFriend)))
        {
            updatedErrors.email = "Incorrect email format"
        }

        if(listIdentifier == "")
        {
            updatedErrors.listId = "Incorrect list identifier"
        }

        setError(updatedErrors)
    }

    let changeFriendEmail = (e) => {
        let emailFriend = e.currentTarget.value
        changeEmailFriend(emailFriend)
    }

    let changeListId = (e) => {
        let listId = e.currentTarget.value
        changeListIdentifier(listId)
    }

    let clickAddFriend = async (e) => {
        let res = await fetch(backendUrl + "/friends?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({ email : emailFriend, listId : listIdentifier })
        })

        if (res.ok)
        {
            createNotification("success", "Friend added succesfully")
            navigate("/myFriends")
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

    let { Text } = Typography

    return (
        <Row align='middle' justify='center' style={{minHeight: "70vh"}}>
            {message != null && <Alert type="error" message={ message }/>}
            
            <Col>
                <Card title='Add Friend Email' style={{minWidth: '300px', maxWidth: '500px'}}>
                    <Input size="large" type="text" 
                        placeholder="enter your friend email" onChange={changeFriendEmail}/>
                    {error.email && <Text type="danger">{error.email}</Text>}

                    <Input style={{marginTop: "10px"}} size="large" type="text" 
                        placeholder="list identifier" onChange={changeListId}/>
                    {error.listId && <Text type="danger">{error.listId}</Text>}

                    <Button style={{marginTop: "10px"}} type="primary" onClick={clickAddFriend} 
                        block>Add friend email</Button>
                </Card>
            </Col>
        </Row>   
    )
}

export default AddFriendComp