import React from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Navbar from './Components/navbar';
import Login from './Components/login';
import Dashboard from './Components/dashboard';
import AddUser from './Components/adduser';
import AddProduct from './Components/addproduct';
import ViewProduct from './Components/viewproduct';
import UpdateProduct from './Components/updateproduct';
import AddBill from './Components/addBill';
import ViewBill from './Components/viewBill';
import CaptureBill from './Components/captureBill';
import Logout from './Components/logout';
import ChangePassword from './Components/changePassword';
import ViewUser from './Components/viewuser';
import ExpiredProduct from './Components/viewExpired';
import FinishedProduct from './Components/viewFinished';

function App() {
  return (
   <div>
    <Router>
      <Routes>
        <Route path='/signin' element={<Login/>}/>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/change' element={<ChangePassword/>}/>
        <Route path='/adduser' element={<AddUser/>}/>
        <Route path='/viewuser' element={<ViewUser/>}/>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/viewproduct' element={<ViewProduct/>}/>
        <Route path='/viewexpired' element={<ExpiredProduct/>}/>
        <Route path='/viewfinished' element={<FinishedProduct/>}/>
        <Route path='/updateproduct/:id' element={<UpdateProduct/>}/>
        <Route path='/addbill' element={<AddBill/>}/>
        <Route path='/viewbill' element={<ViewBill/>}/>
        <Route path='/logout' element={<Logout/>}/>
      </Routes>
    </Router>
   </div>
  );
}

export default App;
