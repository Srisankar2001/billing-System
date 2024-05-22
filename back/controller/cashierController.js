const db = require('../Database/DB');
const bcrypt = require('bcrypt');

const {billGenerate,billItemSave,validateItems} = require('../Function/billFunction')


const changePassword = (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ status: false, message: "Input Id and Password" });
    }

    const sqlCheck = "SELECT * FROM user WHERE id = ?";
    db.query(sqlCheck, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.length == 0) {
            return res.status(400).json({ status: false, message: "Input a valid user id" });
        }

        bcrypt.hash(password, 10, (err, hashPassword) => {
            if (err) {
                return res.status(500).json({ status: false, message: "Error in password hashing" });
            }

            const sqlUpdate = "UPDATE user SET password = ? WHERE id = ?";
            db.query(sqlUpdate, [hashPassword, userId], (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, message: err });
                } else if (result.affectedRows > 0) {
                    return res.status(200).json({ status: true, message: "Password changed Successfully" });
                } else {
                    return res.status(500).json({ status: false, message: "Database Update Error" });
                }
            });
        });
    });
};

const getProduct = (req, res) => {
    const sqlGet = "SELECT * FROM product"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(400).json({ status: false, data: result });
        }
    })
}

const addBill = (req, res) => {
    const { userId, subTotal, discount, grandTotal, paid, balance, method , items } = req.body
    if (!userId || !subTotal || !discount || !grandTotal || !paid || !balance || !method || !items) {
        return res.status(400).json({ status: false, message: "Input all necessary data" });
    }

    if(items.length == 0){
        return res.status(400).json({ status: false, message: "Insert the products" });
    }

    if(!validateItems(items)){
        return res.status(400).json({ status: false, message: "Duplicate products found" });
    }

    const validMethods = ['CASH', 'CARD'];
    if (!validMethods.includes(method)) {
        return res.status(400).json({ status: false, message: "Invalid payment method" });
    }


    const billId = billGenerate(userId,subTotal,discount,grandTotal,paid,balance,method)
    if(!billId){
        return res.status(500).json({ status: false, message: "Bill Generate Fail" });
    }

    items.map(item => {
        const status = billItemSave(billId,item.productId,item.price,item.quantity,item.totalPrice)
        if(!status){
            return res.status(500).json({ status: false, message: "Bill Item insert error" });
        }
    })

    return res.status(200).json({status: true, message: "Bill Generated Successfully" });

}

const viewBill = (req,res) => {
    const { billId } = req.body

    if(!billId){
        return res.status(400).json({ status: false, message: "Input bill id" });
    }

    const sqlBill = "SELECT * FROM bill WHERE id = ?"
    db.query(sqlBill,[billId],(err,result)=>{
        if(err){
            return res.status(400).json({ status: false, message: err });
        }else if(result.length == 0){
            return res.status(400).json({ status: false, message: "Invalid bill id" });
        }else{
            const sqlBillView = "SELECT p.name , p.quantity as product_quantity , b.quantity , b.price , b.total_price FROM bill_detail b JOIN product p ON b.product_id = p.id WHERE b.bill_id = ?"
            db.query(sqlBillView,[billId],(err,result)=>{
                if(err){
                    return res.status(400).json({ status: false, message: err });
                }else if(result.length > 0){
                    return res.status(200).json({ status: true, data : result });
                }else{
                    return res.status(500).json({ status: false, message: "Database fetch error" });
                }
            })
        }
    })
}

const cashierController = {
    changePassword,
    getProduct,
    addBill,
    viewBill
}

module.exports = cashierController