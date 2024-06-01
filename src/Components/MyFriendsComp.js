/* eslint-disable eqeqeq */
import { useEffect, useState } from "react"
import { backendUrl } from "../Globals"


let MyFriendsComp = (props) => {
    let {createNotification} = props

    let [friends, setFriends] = useState([])
    let [message, setMessage] = useState("")

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
            let jsonData = await response.json();
            setFriends(jsonData);
        } 
        else 
        {
            let jsonData = await response.json();
            setMessage(jsonData.error);
        }
    }
    

    let onClickDeleteFriend = async (emailFriend) => {
        createNotification(emailFriend)
        createNotification(backendUrl + "/friends/" + emailFriend + "?apiKey=" 
        + localStorage.getItem("apiKey"))
        let response = await fetch(backendUrl + "/friends/" + emailFriend + "?apiKey=" 
            + localStorage.getItem("apiKey"), { method: "DELETE" })
    
        if (response.ok) 
        {
            let updatedFriends = friends?.filter(friend => friend.emailFriend != emailFriend)
            setFriends(updatedFriends)
            createNotification("Friend successfully deleted")
        } 
        else 
        {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }
    

    return (
        <div>
            <h2>My friends</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}

            <div className="item-list">
                {friends.map ( (friend, key) => 
                    (
                        <div className="item">
                            <h3 className="email">{friend.emailFriend}</h3>
                            <button onClick={() => 
                                {onClickDeleteFriend(friend.emailFriend)}}>Delete friend</button>                              
                        </div>                                               
                    )
                )}
            </div>
        </div>
    )
}

export default MyFriendsComp