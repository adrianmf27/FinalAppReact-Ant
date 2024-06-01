/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import { backendUrl } from "../Globals"
import { _ } from "../Utils"
import { useNavigate } from "react-router-dom"

let CreatePresentComp = (props) => {
    let {createNotification} = props

    let [message, setMessage] = useState("")
    let [present, setPresent] = useState({})
    let [error, setError] = useState({})

    let navigate = useNavigate()

    useEffect(() => {
        checkInputErrors()
    }, [present])

    let checkInputErrors = () => {
        let updatedErrors = {}

        if(present.name == "" || present.name?.length < 2){
            updatedErrors.name = "Incorrect name for item"
        }
    
        if(present.description == "" || present.description?.length < 5){
            updatedErrors.description = "Incorrect description, maybe too short"
        }

        if(present.url == "" || present.url?.length < 5){
            updatedErrors.url = "Incorrect URL, maybe too short"
        }
        
        if(present.price < 0 || present.price == 0 ||present.price == ""){
            updatedErrors.price = "Price must be a positive number"
        }

        setError(updatedErrors)
    }

    let changeProperty = (propertyName, e) => {
        let presentNew = {...present, [propertyName] : e.currentTarget.value}
        setPresent(presentNew)
    }

    let clickCreate = async () => {
        if(_.isEqual(error, {})){

            let apiKey = localStorage.getItem("apiKey");
            let res = await fetch(backendUrl + "/presents?apiKey=" + apiKey, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(present)
            })
    
            if (res.ok)
            {
                createNotification("Present created succesfully")
                navigate("/myPresents")
            }
            else
            {
                let jsonData = await res.json()
                setMessage(typeof jsonData.error === 'string' 
                    ? jsonData.error : JSON.stringify(jsonData.error))
            }
        }
        else
        {
            setMessage("Cannot execute your request, you have errors")
        }
    }

    return (
        <div>
            <h2>Create Presents</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}

            <div className = "center-box">
                <div className="form-group">
                    <input type="text" placeholder="name" 
                        onChange={e => changeProperty("name", e)}></input>
                </div>
                {error.name && <p className="errorForm">{error.name}</p>}

                <div className="form-group">
                    <input type="text" placeholder="description" 
                        onChange={e => changeProperty("description", e)}></input>
                </div>
                {error.description && <p className="errorForm">{error.description}</p>}

                <div className="form-group">
                    <input type="text" placeholder="url" 
                        onChange={e => changeProperty("url", e)}></input>
                </div>
                {error.url && <p className="errorForm">{error.url}</p>}

                <div className="form-group">
                    <input type="number" placeholder="price" 
                        onChange={e => changeProperty("price", e)}></input>
                </div>
                {error.price && <p className="errorForm">{error.price}</p>}

                <button onClick={clickCreate}>Create Present</button>
            </div>
            
        </div>
    )
    
}

export default CreatePresentComp;