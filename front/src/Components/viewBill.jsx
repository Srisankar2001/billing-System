import React, { useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import "../style/viewbill.css"
import Navbar from "./navbar";

function ViewBill() {
    Axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [state, setState] = useState({
        id: "",
        name: "",
        role: ""
    })

    const [id, setId] = useState("")
    const [bill, setBill] = useState({})
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
    }, [navigate])




    const renderData = () => {
        if (data.length > 0) {
            return <div className="viewBill_out">
                <table className="viewBill_table">
                <thead>
                    <tr className="viewBill_table_row">
                        <th className="viewBill_table_heading">Name</th>
                        <th className="viewBill_table_heading">Quantity</th>
                        <th className="viewBill_table_heading">Price</th>
                        <th className="viewBill_table_heading">Unit</th>
                        <th className="viewBill_table_heading">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr className="viewBill_table_row">
                            <th className="viewBill_table_data">{item.product_name}</th>
                            <th className="viewBill_table_data">{item.product_quantity}</th>
                            <th className="viewBill_table_data">{item.price}</th>
                            <th className="viewBill_table_data">{item.unit}</th>
                            <th className="viewBill_table_data">{item.total_price}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="viewBill_out_data_div">
                    <span className="viewBill_out_data_row">Sub Total: {bill.sub_total}</span>
                    <span className="viewBill_out_data_row">Discount: {bill.discount}</span>
                    <span className="viewBill_out_data_row">Grand Total: {bill.grand_total}</span>
                    <span className="viewBill_out_data_row">Paid: {bill.paid}</span>
                    <span className="viewBill_out_data_row">Balance: {bill.balance}</span>
            </div>
            </div>
        } else {
            return null
        }
    }

    const handleSearch = async (e) => {
        if (!isNaN(id) && Number(id) > 0) {
            const sendData = async () => {
                try {
                    const postData = {
                        billId: id
                    }
                    const response = await Axios.post("http://localhost:3001/bill/get", postData)
                    if (response.data.status) {
                        setBill(response.data.data.bill)
                        setData(response.data.data.billDetail)
                    } else {
                        alert(response.data.message)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            sendData()
        } else {
            alert("Enter a valid bill id")
        }
    }

    return (
        <div className="viewBill_wrapper">
            <Navbar />
            <div className="viewBill_container">
                <div className="viewBill_heading_div">
                    <span className="viewBill_heading">View Bill</span>
                </div>
                <form className="viewBill_form">
                    <div className="viewBill_form_div">
                        <label className="viewBill_form_label">Bill Id : </label>
                        <input type="number" className="viewBill_form_field" name="id" value={id} placeholder="Enter bill ID" onChange={(e) => { setId(e.target.value) }} />
                    </div>
                    <div className="viewBill_form_btn">
                        <input type="button" value="Search" className="viewBill_form_btn_search" onClick={(e) => handleSearch(e)} />
                    </div>
                </form>
                {renderData()}
            </div>
        </div>
    )
}

export default ViewBill