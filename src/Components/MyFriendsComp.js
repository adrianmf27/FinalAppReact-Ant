/* eslint-disable eqeqeq */
import { useEffect, useState } from "react"
import { backendUrl } from "../Globals"
import { Button, Table } from "antd"


let MyFriendsComp = (props) => {
    let {createNotification} = props

    let [friends, setFriends] = useState([])
    let [message, setMessage] = useState(null)

    useEffect(() => {
        getFriends()
    }, [])

    let getFriends = async () => {
        let response = await fetch(backendUrl + "/friends?apiKey=" + localStorage.getItem("apiKey"), {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
    
        if (response.ok) 
        {
            let jsonData = await response.json()
            setFriends(jsonData)
        } 
        else 
        {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }
    

    let onClickDeleteFriend = async (emailFriend) => {
        let response = await fetch(backendUrl + "/friends/" + emailFriend + "?apiKey=" 
            + localStorage.getItem("apiKey"), { method: "DELETE" })
    
        if (response.ok) 
        {
            let updatedFriends = friends?.filter(friend => friend.emailFriend != emailFriend)
            setFriends(updatedFriends)
            createNotification("success", "Friend successfully deleted")
        } 
        else 
        {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }
    
    let columns = [
        {
            title: "Friend email",
            dataIndex: "emailFriend"
        },
        {
            title: "Delete",
            dataIndex: "emailFriend",
            render: (emailFriend) => <Button onClick={() => {onClickDeleteFriend(emailFriend)}}>Delete</Button>
        }        
    ]

    return (
        <div>
            <h2>My friends</h2>
            {message !== null && <h3 className="errorMessage">{message}</h3>}
            <Table columns={columns} dataSource={friends}/>   
        </div>
    )
}

export default MyFriendsComp