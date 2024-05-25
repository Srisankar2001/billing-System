import React from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Navbar from './Components/navbar';
import Login from './Components/login';
import Dashboard from './Components/dashboard';
import AddUser from './Components/adduser';
import AddProduct from './Components/addproduct';
import ViewProduct from './Components/viewproduct';

function App() {
  return (
   <div>
    <Router>
      <Routes>
        <Route path='/signin' element={<Login/>}/>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/adduser' element={<AddUser/>}/>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/viewproduct' element={<ViewProduct/>}/>
      </Routes>
    </Router>
   </div>
  );
}

export default App;
