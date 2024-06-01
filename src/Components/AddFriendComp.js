/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { backendUrl } from "../Globals"
import { useNavigate } from "react-router-dom"
import { emailPattern } from "../Utils"


let AddFriendComp = (props) => {
    let {createNotification} = props
    let [emailFriend, changeEmailFriend] = useState(null)

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

        setError(updatedErrors)
    }

    let changeFriendEmail = (e) => {
        let emailFriend = e.currentTarget.value
        changeEmailFriend(emailFriend)
    }

    let clickAddFriend = async (e) => {
        let res = await fetch(backendUrl + "/friends?apiKey=" + localStorage.getItem("apiKey"), {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({ email : emailFriend })
        })

        if (res.ok)
        {
            createNotification("Friend added succesfully")
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

    return (
        <div>
            <h2>Add a friend</h2>
            <h3>{message}</h3>

            <div className="cener-box">
                <div className="form-group">
                    <input type="text" placeholder="enter your friend email" 
                        onChange={changeFriendEmail}></input>
                </div>
                {error.email && <p className="errorForm">{error.email}</p>}
                <button onClick={clickAddFriend}>Add Friend</button>
            </div>
        </div>
    )
}

export default AddFriendComp