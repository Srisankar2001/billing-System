import React, { useState , useEffect} from "react";
import Axios  from "axios";
import "../style/navbar.css"
import { useNavigate } from "react-router-dom";
function Navbar() {
    Axios.defaults.withCredentials = true
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })

    const [isAdmin, setIsAdmin] = useState(false)
    const [isInventory, setIsInventory] = useState(false)
    const [isCashier, setIsCashier] = useState(false)
    useEffect(() => {
        const sendData = async () => {
            const response = await Axios.get("http://localhost:3001/auth/verify")
            if (response.data.status) {
                setState({
                    id: response.data.data.id,
                    name: response.data.data.name,
                    role: response.data.data.role
                })
            }
        }
        sendData()
        if(state.id !== ""){
            if(state.role === "ADMIN"){
                setIsAdmin(true)
            }else if(state.role === "INVENTORY"){
                setIsInventory(true)
            }else if(state.role === "CASHIER"){
                setIsCashier(true)
            }
        }
    })
    return (
        <nav className="navbar_container">
            <span className="navbar_heading">Main Menu</span>
            <ul className="navbar_list">
                {(isAdmin || isCashier || isInventory) && <li className="navbar_list_item">
                    <a href="/" className="navbar_list_item_link">Dashboard</a>
                </li>}
                {isAdmin && <li className="navbar_list_item">
                    <a href="/adduser" className="navbar_list_item_link">Add User</a>
                </li>}
                {(isAdmin || isInventory) && <li className="navbar_list_item">
                    <a href="/addproduct" className="navbar_list_item_link">Add Product</a>
                </li>}
                <li className="navbar_list_item">
                    <a href="/viewproduct" className="navbar_list_item_link">View Product</a>
                </li>
                {(isAdmin || isCashier) && <li className="navbar_list_item">
                    <a href="/addbill" className="navbar_list_item_link">Add Bill</a>
                </li>}
            </ul>
        </nav>
    )
}

export default Navbar