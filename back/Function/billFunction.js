const db = require('../Database/DB')

const billGenerate = (userId,subTotal,discount,grandTotal,paid,balance,method) => {
    const sqlBill = "INSERT INTO bill(user_id,sub_total,discount,grant_total,paid,balance,method,date) VALUES(?,?,?,?,?,?,?,NOW())"
    db.query(sqlBill,[userId,subTotal,discount,grandTotal,paid,balance,method],(err,result)=>{
        if(err){
            return false
        }else if(result.insertId){
            return result.insertId
        }else{
            return false
        }
    })
}

const billItemSave = (billId,productId,price,quanity,total_price) => {
    const sqlBillItem = "INSERT INTO bill_detail(bill_id,product_id,price,quantity,total_price) VALUES(?,?,?,?,?)"
    db.query(sqlBillItem,[billId,productId,price,quanity,total_price],(err,result)=>{
        if(err){
            return false
        }else if(result.affectedRows > 0){
            return true
        }else{
            return false
        }
    })
}


const validateItems = (items) => {
    const itemIds = items.map(item => item.productId); 
    const uniqueItemIds = new Set(itemIds);

    return uniqueItemIds.size === itemIds.length;
};


module.exports = {billGenerate,billItemSave,validateItems}