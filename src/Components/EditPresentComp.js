/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import { useNavigate, useParams } from "react-router-dom";

let EditPresentComp = (props) => {
    let {createNotification} = props
    
    let [message, setMessage] = useState("")
    let [present, setPresent] = useState([])
    
    let {presentId} = useParams()
    let navigate = useNavigate()
    
    useEffect(() => {
        getPresens()
    }, [])

    let getPresens = async () => {
        let response = await fetch(backendUrl + "/presents?apiKey=" + localStorage.getItem("apiKey"), {
            method: "GET",
            headers: {"Content-Type" : "application/json"}
        })
    
        if(response.ok)
        {
            let jsonData = await response.json()
            setPresent(jsonData)
        }
        else
        {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }


    let changeProperty = (propertyName, e) => {
        let presentNew = {...present, [propertyName] : e.currentTarget.value}
        setPresent(presentNew)
    }

    let clickEdit= async () => {
        let res = await fetch(backendUrl + "/presents/" + presentId 
            + "?apiKey=" + localStorage.getItem("apiKey"), {
                method: "PUT",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(present)
        })

        if (res.ok)
        {
            createNotification("Item succesfully edited")
            navigate("/myPresents")
        }
        else
        {
            let jsonData = await res.json()
            setMessage(jsonData.error)
        }
    }

    return (
        <div>
            <h2>Edit Item</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}

            <div className = "center-box">
                <div className="form-group">
                    <input type="text" placeholder="name" 
                        onChange={e => changeProperty("name", e)}></input>
                </div>
               
                <div className="form-group">
                    <input type="text" placeholder="description" 
                        onChange={e => changeProperty("description", e)}></input>
                </div>
             
                <div className="form-group">
                    <input type="text" placeholder="url" 
                        onChange={e => changeProperty("url", e)}></input>
                </div>

                <div className="form-group">
                    <input type="number" placeholder="price" 
                        onChange={e => changeProperty("price", e)}></input>
                </div>

                <button onClick={clickEdit}>Edit Present</button>
            </div>
            
        </div>
    )
}

export default EditPresentComp;