/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Table } from "antd";
import { backendUrl } from "../Globals";

let ChoosenPresentsPage = (props) => {
    let {createNotification} = props

    let [chosenPresents, setChosenPresents] = useState([])
    let [message, setMessage] = useState(null)
    
    useEffect(() => {
        fetchChosenPresents()
    }, [])

    const fetchChosenPresents = async () => {
        try {
            let response = await fetch(backendUrl + "/presents?myPresents=" + true
                + "&apiKey=" + localStorage.getItem("apiKey"), {
                    method: "GET",
                    headers: {"Content-Type" : "application/json"}
            })

            if (response.ok) 
            {
                let data = await response.json()

                if(data.length > 0)
                {
                    setChosenPresents(data)
                    createNotification("success", "Presents found")    
                }   
                else
                {
                    createNotification("error", "No presents choosed")   
                }
            } 
            else 
            {
                const jsonData = await response.json()
                setMessage(jsonData.error)
            }
        } 
        catch (error) 
        {
            setMessage(error.message)
        }
    }

    let columns = [
        {
            title: "Present name",
            dataIndex: "name"
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
            dataIndex: "choosenBy"
        },
        {
            title: "List Identifier",
            dataIndex: "listId"
        }
    ]

    return (
        <div>
            <h2>Choosen Presents</h2>
            {message !== "" && <h3 className="errorMessage"> {message} </h3>}
            <Table columns={columns} dataSource={chosenPresents}/>            
        </div>
    )
}

export default ChoosenPresentsPage