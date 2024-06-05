/* eslint-disable eqeqeq */
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { backendUrl } from "../Globals"
import { Button, Table } from "antd"

let MyPresentsComp = (props) => {
    let {createNotification} = props

    let [presents, setPresents] = useState([])
    let [message, setMessage] = useState("")

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
            setPresents(jsonData)
        }
        else
        {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let onClickDeleteItem = async (id) => {
        let response = await fetch(backendUrl + "/presents/" + id + "?apiKey=" 
            + localStorage.getItem("apiKey"), { method : "DELETE" })
        
        if(response.ok)
        {
            let updatedPresents = presents.filter(present => present.id != id)
            setPresents(updatedPresents)
            createNotification("success", "Present succesfully deleted")
        }
        else
        {
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let onClickEditItem = (id) => {
        navigate("/edit/" + id)
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
            title: "Present price (euros)",
            dataIndex: "price"
        }, 
        {
            title: "Choosen By",
            dataIndex: "choosenBy"
        },
        {
            title: "List Identifier",
            dataIndex: "listId"
        },
        {
            title: "Delete",
            dataIndex: "id",
            render: (id) => <Button onClick={() => {onClickDeleteItem(id)}}>Delete</Button>
        },
        {
            title: "Edit",
            dataIndex: "id",
            render: (id) => <Button onClick={() => {onClickEditItem(id)}}>Edit</Button>
        }
    ]

    return (
        <div>
            <h2>My Presents</h2>
            {message !== "" && <h3 className="errorMessage">{message}</h3>}
            <Table columns={columns} dataSource={presents}/>            
        </div>
    )
}
export default MyPresentsComp;