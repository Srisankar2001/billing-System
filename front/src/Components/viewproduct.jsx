import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import "../style/viewproduct.css"
import Navbar from "./navbar";

function ViewProduct() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })

    const [isAuth, setIsAuth] = useState(false) /* Check if login person is CASHIER or NOT. If CASHIER then he can only view items else They can modify it */
    const [data, setData] = useState([])

    useEffect(() => {
        const sendData = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/auth/verify")
                if (response.data.status) {
                    setState({
                        id: response.data.data.id,
                        name: response.data.data.name,
                        role: response.data.data.role
                    })
                } else {
                    alert(response.data.message)
                    navigate("/signin")
                }
            } catch (error) {
                console.log(error)
                navigate("/signin")
            }
        }
        sendData()
        if (state.role !== "") {
            if (state.role === "ADMIN" || state.role === "INVENTORY") {
                setIsAuth(true)
            }
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/product/all")
                if (response.data.status) {
                    setData(response.data.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [state.id])

    const renderData = () => {
        if (data.length === 0) {
            return (
                <span className="viewProduct_message">No items to preview</span>
            )
        } else {
            return data.map(item => (
                <tr className="viewProduct_item">
                    <td className="viewProduct_item_image">
                        <img src={`http://localhost:3001/images/${item.image}`}/>
                    </td>
                    <td className="viewProduct_item_data">{item.id}</td>
                    <td className="viewProduct_item_data">{item.name}</td>
                    <td className="viewProduct_item_data">{item.quantity}</td>
                    <td className="viewProduct_item_data">{item.stock}</td>
                    <td className="viewProduct_item_data">{item.self}</td>
                    <td className="viewProduct_item_data">{item.selling_price}</td>
                    <td className="viewProduct_item_data">{item.expiry_date.split('T')[0]}</td>
                    <td className="viewProduct_item_data">
                        <input type="button" value="Update" onClick={()=>handleUpdate(item.id)} className="viewProduct_item_btn_update"/>
                        <input type="button" value="Delete" onClick={()=>handleDelete(item.id)} className="viewProduct_item_btn_delete"/>
                    </td>
                </tr>
            )
            )
        }
    }

    const handleUpdate = (id)=>{
        console.log("Update Id:"+id)
    }

    const handleDelete = (id) =>{
        console.log("Delete Id:"+id)
    }
    return (
        <div className="viewProduct_wrapper">
            <Navbar />
            <div className="viewProduct_container">
                <div className="viewProduct_heading_div">
                    <span className="viewProduct_heading">View Product</span>
                </div>
                <div className="viewProduct_item_div">
                    <table className="viewProduct_table">
                        <tr className="viewProduct_table_row">
                            <th className="viewProduct_table_heading">Image</th>
                            <th className="viewProduct_table_heading">ID</th>
                            <th className="viewProduct_table_heading">Name</th>
                            <th className="viewProduct_table_heading">Quantity</th>
                            <th className="viewProduct_table_heading">Stock</th>
                            <th className="viewProduct_table_heading">Self no</th>
                            <th className="viewProduct_table_heading">Price</th>
                            <th className="viewProduct_table_heading">Expiry Date</th>
                            <th className="viewProduct_table_heading">Action</th>
                        </tr>
                    </table>
                    <tbody>
                    {renderData()}
                    </tbody>
                </div>
            </div>
        </div>
    )
}

export default ViewProduct