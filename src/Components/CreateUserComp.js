/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { emailPattern } from "../Utils"
import { backendUrl } from "../Globals"


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
            createNotification("User created succesfully")
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

    return (
        <div>
            <h2>Register User</h2>
            <h3>{message}</h3>

            <div className="cener-box">
                <div className="form-group">
                    <input type="text" placeholder="enter your name" onChange={changeUserName}></input>
                </div>
                {error.name && <p className="errorForm">{error.name}</p>}
                <div className="form-group">
                    <input type="text" placeholder="enter your email" onChange={changeUserEmail}></input>
                </div>
                {error.email && <p className="errorForm">{error.email}</p>}
                <div className="form-group">
                    <input type="password" placeholder="enter your password" onChange={changeUserPass}></input>
                </div>
                {error.password && <p className="errorForm">{error.password}</p>}
                <button onClick={clickCreate}>Create account</button>
            </div>
        </div>
    )
}

export default CreateUserComp;