/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { emailPattern } from "../Utils"
import { backendUrl } from "../Globals"

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
            createNotification("Friend found")

            let resFriend = await fetch(backendUrl + "/presents?userEmail=" + emailFriend + "&apiKey=" 
                + localStorage.getItem("apiKey"))

            if(resFriend.ok)
            {
                let jsonData = await resFriend.json()

                if(jsonData.length == 0)
                {
                    createNotification("This user has no presents")
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
            createNotification("Present succesfully choosed")
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

    return (
        <div>
            <h2>Search for a friend</h2>
            <h3>{message}</h3>

            <div className="cener-box">
                <div className="form-group">
                    <input type="text" placeholder="enter your friend email" 
                        onChange={searchFriendEmail}></input>
                </div>
                {error.email && <p className="errorForm">{error.email}</p>}
                <button onClick={clickSearchFriend}>Search friend</button>
            </div>

            <div className="item-list">
                { presents.length > 0 && presents?.map (present => 
                    (
                        <div className="item">
                            <h3 className="name">Title: {present.name}</h3>
                            <h3 className="description">Description: {present.description}</h3>
                            <h3 className="url">URL: {present.url}</h3>
                            <h3 className="price">Price: {present.price} €</h3>
                            <button onClick={() => {onClickChoose(present.id)}}>Choose</button>                              
                        </div>                                              
                    )
                )}
            </div>
        </div>
    )
}

export default GivePresentComp