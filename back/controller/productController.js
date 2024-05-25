const db = require('../Database/DB');

require('dotenv').config()


const getProductCount = (req, res) => {
    const sqlGet = "SELECT COUNT(*) AS count FROM product"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}


const getAllProduct = (req, res) => {
    const sqlGet = "SELECT * FROM product"
    db.query(sqlGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result });
        }
    })
}

const getProduct = (req, res) => {
    const { id } = req.body
    const sqlGet = "SELECT * FROM product WHERE id = ?"
    db.query(sqlGet,[id], (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result[0] });
        }
    })
}

const getExpiryProduct = (req, res) => {
    const sqlExpiryGet = "SELECT * FROM product WHERE expiry_date <= NOW()"
    db.query(sqlExpiryGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result });
        }
    })
}

const getStockFinish = (req, res) => {
    const sqlStockGet = "SELECT * FROM product WHERE stock = 0"
    db.query(sqlStockGet, (err, result) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else {
            return res.status(200).json({ status: true, data: result });
        }
    })
}

const addProduct = (req, res) => {
    const { name, category, quantity, stock, description, self, manufacturedDate, expiryDate, buyingPrice, sellingPrice, company, userId } = req.body
    const image = req.file.filename
    if (!name || !category || !stock || !quantity || !self || !manufacturedDate || !expiryDate || !buyingPrice || !sellingPrice || !company || !userId || !image) {
        return res.status(400).json({ status: false, message: "Input all necessary infomation" });
    }

    const sqlUnique = "SELECT * FROM product WHERE name = ? AND quantity = ? "
    db.query(sqlUnique, [name, quantity], (err, resultUnique) => {
        if (err) {
            return res.status(500).json({ status: false, message: err });
        } else if (resultUnique.length > 0) {
            return res.status(400).json({ status: false, message: "Product already exists"});
        } else {
            const sqlAdd = "INSERT INTO product(name,category,stock,quantity,description,self,manufactured_date,expiry_date,buying_price,selling_price,company,image,created_by,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())"
            db.query(sqlAdd, [name, category, stock, quantity, description, self, manufacturedDate, expiryDate, buyingPrice, sellingPrice, company, image, userId], (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, message: err });
                } else if (result.affectedRows > 0) {
                    return res.status(200).json({ status: true, message: "Product Added Successfully" });
                } else {
                    return res.status(200).json({ status: false, message: "Product Add Fail" });
                }
            })
        }
    })
}

const updateProduct = (req, res) => {
    const { id, name, category, stock, quantity, description, self, manufacturedDate, expiryDate, buyingPrice, sellingPrice, company, userId } = req.body

    if (!id || !name || !category || !stock || !quantity || !self || !manufacturedDate || !expiryDate || !buyingPrice || !sellingPrice || !company || !userId) {
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
    db.query(sqlUpdate, [name, category, stock, quantity, description, self, manufacturedDate, expiryDate, buyingPrice, sellingPrice, company, userId, id], (err, result) => {
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



const productController = {
    getProductCount,
    getAllProduct,
    getProduct,
    getExpiryProduct,
    getStockFinish,
    addProduct,
    updateProduct,
    deleteProduct
}
module.exports = productController