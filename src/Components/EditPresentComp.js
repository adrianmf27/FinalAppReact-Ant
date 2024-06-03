/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Card, Col, Input, Row } from "antd";

let EditPresentComp = (props) => {
    let {createNotification} = props
    
    let [message, setMessage] = useState(null)
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
        <Row align='middle' justify='center' style={{minHeight: "70vh"}}>
            {message != null && <Alert type="error" message={ message }/>}
            
            <Col>
                <Card title='Edit Present' style={{minWidth: '300px', maxWidth: '500px'}}>
                    <Input size="large" type="text" 
                            placeholder="name" onChange={e => changeProperty("name", e)}/>
                    
                    <Input style={{marginTop: "10px"}} size="large" type="text" 
                            placeholder="description" onChange={e => changeProperty("description", e)}/>
                    
                    <Input style={{marginTop: "10px"}} size="large" type="text" 
                            placeholder="url" onChange={e => changeProperty("url", e)}/>
                   
                    <Input style={{marginTop: "10px"}} size="large" type="number" 
                            placeholder="price" onChange={e => changeProperty("price", e)}/>
                   
                   <Input style={{marginTop: "10px"}} size="large" type="text" 
                            placeholder="list identifier" onChange={e => changeProperty("listId", e)}/>

                    <Button style={{marginTop: "10px"}} type="primary" onClick={clickEdit} 
                        block>Edit present</Button>
                </Card>
            </Col>
        </Row>   
    )
}

export default EditPresentComp;