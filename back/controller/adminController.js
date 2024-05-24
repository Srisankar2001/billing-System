const db = require('../Database/DB');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
require('dotenv').config()

const {billGenerate,billItemSave,validateItems} = require('../Function/billFunction')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('image');

const register = (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ status: false, message: "Input Name, Email, Password, and Role" });
    }

    const validRoles = ['ADMIN', 'CASHIER', 'INVENTORY'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ status: false, message: "Invalid Role" });
    }

    const sqlEmail = "SELECT * FROM user WHERE email = ?";
    db.query(sqlEmail, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.length > 0) {
            return res.status(400).json({ status: false, message: "Email already exists" });
        }

        bcrypt.hash(password, 10, (err, hashPassword) => {
            if (err) {
                return res.status(500).json({ status: false, message: "Error in password hashing" });
            }

            const sqlRegister = "INSERT INTO user(name, email, password, role, created_at) VALUES(?, ?, ?, ?, NOW())";
            db.query(sqlRegister, [name, email, hashPassword, role], (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, message: err });
                } else if (result.affectedRows > 0) {
                    return res.status(200).json({ status: true, message: "Registered Successfully" });
                } else {
                    return res.status(500).json({ status: false, message: "Database Insert Error" });
                }
            });
        });
    });
};

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

const getUser = (req, res) => {
    const sqlGet = "SELECT * FROM user WHERE role != 'ADMIN'"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result });
        }
    })
}

const getAdminCount = (req,res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM user WHERE role = 'ADMIN'"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}
const getCashierCount = (req,res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM user WHERE role = 'CASHIER'"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}

const getInventoryCount = (req,res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM user WHERE role = 'INVENTORY'"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}

const getProductCount = (req,res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM product"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}

const getBillCount = (req,res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM bill"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}



const getProduct = (req, res) => {
    const sqlGet = "SELECT * FROM product"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: false, data: result });
        }
    })
}

const getExpiryProduct = (req,res)=>{
    const sqlExpiryGet = "SELECT * FROM product WHERE expiry_date <= NOW()"
    db.query(sqlExpiryGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: false, data: result });
        }
    })
}

const getStockFinish = (req,res) => {
    const sqlStockGet = "SELECT * FROM product WHERE stock = 0"
    db.query(sqlStockGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: false, data: result });
        }
    })
}

const addProduct = (req, res) => {
    console.log(req.body)
    console.log(req.file)
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ status: false, message: "Error uploading file" });
        } else if (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    })
    const { name, category, quantity , stock , description, self, manufactredDate, expiryDate, buyingPrice, sellingPrice, company, userId } = req.body
    const { image } = req.file

    if (!name || !category || !stock || !quantity || !self || !manufactredDate || !expiryDate || !buyingPrice || !sellingPrice || !company || !userId || !image) {
        return res.status(400).json({ status: false, message: "Input all necessary infomation" });
    }

    const sqlUnique = "SELECT * FROM product WHERE name = ? AND unit = ? "
    db.query(sqlUnique, [name, quantity], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.length > 0) {
            return res.status(400).json({ status: false, message: "Product already exists" });
        }
    })

    const sqlAdd = "INSERT INTO product(name,category,stock,quantity,description,self,manufactured_date,expiry_date,buying_price,selling_price,company,image,created_by,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())"
    db.query(sqlAdd, [name, category, stock, quantity, description, self, manufactredDate, expiryDate, buyingPrice, sellingPrice, company, image, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.affectedRows > 0) {
            return res.status(200).json({ status: true, message: "Product Added Successfully" });
        } else {
            return res.status(200).json({ status: false, message: "Product Add Fail" });
        }
    })
}

const updateProduct = (req, res) => {
    const { id, name, category, stock, quantity, description, self, manufactredDate, expiryDate, buyingPrice, sellingPrice, company, userId } = req.body

    if (!id || !name || !category || !stock || !quantity || !self || !manufactredDate || !expiryDate || !buyingPrice || !sellingPrice || !company || !userId) {
        return res.status(400).json({ status: false, message: "Input all necessary data" });
    }

    const sqlExist = "SELECT * FROM product WHERE id = ?"
    db.query(sqlUnique, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.length == 0) {
            return res.status(400).json({ status: false, message: "Product does not exists" });
        }
    })

    const sqlUpdate = "UPDATE product SET name = ? , category = ? , stock = ? , quantity = ? , description = ? , self = ? , manufactured_date = ? , expiry_date = ? , buying_price = ? , selling_price = ? , company = ? , updated_by = ? , updated_at = NOW() WHERE id = ?"
    db.query(sqlUpdate, [name, category, stock, quantity, description, self, manufactredDate, expiryDate, buyingPrice, sellingPrice, company, userId, id], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.affectedRows > 0) {
            return res.status(200).json({ status: true, message: "Product Updated Successfully" });
        } else {
            return res.status(200).json({ status: false, message: "Product Update Fail" });
        }
    })
}

const deleteProduct = (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ status: false, message: "Input product id" });
    }

    const sqlCheck = "SELECT * FROM product WHERE id = ?"
    db.query(sqlCheck, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.length == 0) {
            return res.status(400).json({ status: false, message: "Product does not exists" });
        }
    })

    const sqlDelete = "DELETE FROM product WHERE id = ?"
    db.query(sqlDelete, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (result.affectedRows > 0) {
            return res.status(200).json({ status: true, message: "Product Deleted Successfully" });
        } else {
            return res.status(200).json({ status: false, message: "Product Delete Fail" });
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


const adminController = {
    register,
    getUser,
    getAdminCount,
    getCashierCount,
    getInventoryCount,
    getProductCount,
    getBillCount,
    changePassword,
    getProduct,
    getExpiryProduct,
    getStockFinish,
    addProduct,
    updateProduct,
    deleteProduct,
    addBill,
    viewBill
}
module.exports = adminController