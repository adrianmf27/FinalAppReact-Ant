/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import { backendUrl } from "../Globals"
import { _ } from "../Utils"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Card, Col, Input, Row, Typography } from "antd"

let CreatePresentComp = (props) => {
    let {createNotification} = props

    let [message, setMessage] = useState(null)
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
                createNotification("success", "Present created succesfully")
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

    let { Text } = Typography

    return (
        <Row align='middle' justify='center' style={{minHeight: "70vh"}}>
            {message != null && <Alert type="error" message={ message }/>}
            
            <Col>
                <Card title='Create Present' style={{minWidth: '300px', maxWidth: '500px'}}>
                    <Input size="large" type="text" 
                            placeholder="name" onChange={e => changeProperty("name", e)}/>
                    {error.name && <Text type="danger">{error.name}</Text>}

                    <Input style={{marginTop: "10px"}} size="large" type="text" 
                            placeholder="description" onChange={e => changeProperty("description", e)}/>
                    {error.description && <Text type="danger">{error.description}</Text>}

                    <Input style={{marginTop: "10px"}} size="large" type="text" 
                            placeholder="url" onChange={e => changeProperty("url", e)}/>
                    {error.url && <Text type="danger">{error.url}</Text>}

                    <Input style={{marginTop: "10px"}} size="large" type="number" 
                            placeholder="price" onChange={e => changeProperty("price", e)}/>
                    {error.price && <Text type="danger">{error.price}</Text>}

                    <Button style={{marginTop: "10px"}} type="primary" onClick={clickCreate} 
                        block>Create present</Button>
                </Card>
            </Col>
        </Row>   
    )
    
}

export default CreatePresentComp;