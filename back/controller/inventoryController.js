const db = require('../Database/DB');
const bcrypt = require('bcrypt');

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

const getExpiryProduct = (req,res)=>{
    const sqlExpiryGet = "SELECT * FROM product WHERE expiry_date <= NOW()"
    db.query(sqlExpiryGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(400).json({ status: false, data: result });
        }
    })
}

const getStockFinish = (req,res) => {
    const sqlStockGet = "SELECT * FROM product WHERE stock = 0"
    db.query(sqlStockGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(400).json({ status: false, data: result });
        }
    })
}

const addProduct = (req, res) => {
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

const inventoryController = {
    changePassword,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getExpiryProduct,
    getStockFinish
}

module.exports = inventoryController