const express = require('express')
const db = require('./Database/DB')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRouter = require("./router/authRouter")
const adminRouter = require("./router/adminRouter")
const cashierRouter = require("./router/cashierRouter")
const inventoryRouter = require("./router/inventoryRouter")

const app = express()

app.use(express.json())
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true
}))
app.use(cookieParser())
app.use(express.static('public'))

app.use('/auth',authRouter)
app.use('/admin',adminRouter);
app.use('/cashier',cashierRouter);
app.use('/inventory',inventoryRouter);

db.connect((err)=>{
    if(err){
        console.log("DB connection fail")
    }else{
        console.log("DB connect successfully")
        app.listen(3001,()=>{
            console.log("Server Started")
        })
    }
})