import React from "react";
import "../style/navbar.css"
function Navbar(){
    return(
        <nav className="navbar_container">
            <span className="navbar_heading">Main Menu</span>
            <ul className="navbar_list">
                <li className="navbar_list_item">
                    <a href="#" className="navbar_list_item_link">Dashboard</a>
                </li>
                <li className="navbar_list_item">
                    <a href="#" className="navbar_list_item_link">Register</a>
                </li>
                <li className="navbar_list_item">
                    <a href="#" className="navbar_list_item_link">Add Product</a>
                </li>
                <li className="navbar_list_item">
                    <a href="#" className="navbar_list_item_link">View Product</a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar