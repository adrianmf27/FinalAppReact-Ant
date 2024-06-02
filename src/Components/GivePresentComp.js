/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { emailPattern } from "../Utils"
import { backendUrl } from "../Globals"
import { Alert, Button, Card, Col, Input, Row, Table, Typography } from "antd"

let GivePresentComp = (props) =>{
    let {createNotification} = props

    let [emailFriend, changeEmailFriend] = useState(null)
    let [presents, setPresents] = useState([])

    let [error, setError] = useState({})
    let [message, setMessage] = useState(null)

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

        setError(updatedErrors)
    }

    let searchFriendEmail = (e) => {
        let emailFriend = e.currentTarget.value
        changeEmailFriend(emailFriend)
    }

    let clickSearchFriend = async (e) => {
        let res = await fetch(backendUrl + "/friends/friend?emailFriend=" + emailFriend + "&apiKey=" 
            + localStorage.getItem("apiKey"))

        if (res.ok)
        {
            createNotification("success", "Friend found")

            let resFriend = await fetch(backendUrl + "/presents?userEmail=" + emailFriend + "&apiKey=" 
                + localStorage.getItem("apiKey"))

            if(resFriend.ok)
            {
                let jsonData = await resFriend.json()

                if(jsonData.length == 0)
                {
                    createNotification("error", "This user has no presents")
                }
                else
                {
                    setPresents(jsonData)
                }
                
            }
        }
        else
        {
            let jsonData = await res.json()
            setMessage(jsonData.error)
            
        }
    }

    let onClickChoose = async (id) => {
        let response = await fetch(backendUrl + "/presents/" + id + "?emailFriend=" + emailFriend 
            + "&apiKey=" + localStorage.getItem("apiKey"), { 
                method : "PUT", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})})
        
        if(response.ok)
        {
            createNotification("success", "Present succesfully choosed")
        }
        else
        {
            let jsonData = await response.json();
            const errorMessage = typeof jsonData.error === 'string' 
                ? jsonData.error 
                : JSON.stringify(jsonData.error)
            setMessage(errorMessage || "An error occurred")
        }
    }

    let columns = [
        {
            title: "Present name",
            dataIndex: "name"
        },
        {
            title: "Seller email",
            dataIndex: "email"
        },
        {
            title: "Present description",
            dataIndex: "description"
        },        
        {
            title: "Present URL",
            dataIndex: "url"
        },
        {
            title: "Present price",
            dataIndex: "price"
        },
        {
            title: "Choosen By",
            dataIndex: "id",
            render: (id) => <Button onClick={() => {onClickChoose(id)}}>Choose present</Button>
        }        
    ]

    let { Text } = Typography

    return (
        <div>
            <Row align='middle' justify='center' style={{minHeight: "70vh"}}>
                {message != null && <Alert type="error" message={ message }/>}
                
                <Col>
                    <Card title='Add Friend Email' style={{minWidth: '300px', maxWidth: '500px'}}>
                        <Input size="large" type="text" 
                            placeholder="enter your friend email" onChange={searchFriendEmail}/>
                        {error.email && <Text type="danger">{error.email}</Text>}

                        <Button style={{marginTop: "10px"}} type="primary" onClick={clickSearchFriend} 
                            block>Search friend email</Button>
                    </Card>
                </Col>
            </Row> 

           {presents?.length > 0 && <Table columns={columns} dataSource={presents}/>}
        </div>
    )
}

export default GivePresentComp