const express = require('express')
const mysql = require('mysql2/promise')
const app = express()

app.use(express.json());

// establish connection to db
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ASSIGMENT_4DB'
})

//==========================================================================================
//2. Create REST API endpoints to perform CRUD operations for the Products table:
// 1. Create a product
app.post('/products', async (req, res) => {
    try {
        const { productname, price, stockquantity, supplierid } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO Products (productname, price, stockquantity, supplierid)
VALUES (?, ?, ?, ?)`,
            [productname, price, stockquantity, supplierid ?? null]
        );

        res.status(201).json({
            message: 'product created successfully',
            productid: result.insertId
        });

    } catch (err) {
        res.status(500).json({
            message: 'error creating product'
        });
    }
});
//---------------------------------------------------------------------------------------
// get products
app.get('/products', async (req, res) => {
    try {
        const [products] = await pool.execute(
            'SELECT * FROM Products'
        );

        res.status(200).json(products);

    } catch (err) {
        res.status(500).json({
            message: 'error happened'
        });
    }
});
//---------------------------------------------------------------------------------------
// Get product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await pool.execute(
            'SELECT * FROM Products WHERE productid = ?',
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                message: 'product not found'
            });
        }

        res.status(200).json(products[0]);

    } catch (error) {
        res.status(500).json({
            message: 'error happened'
        });
    }
});
//---------------------------------------------------------------------------------------
// update product
app.put('/products/:id', async (req, res) => {
    try {
        const { productname, price, stockquantity, supplierid } = req.body;
        const { id } = req.params;

        const [result] = await pool.execute(
            `UPDATE Products
SET productname = ?, price = ?, stockquantity = ?, supplierid = ?
WHERE productid = ?`,
            [productname, price, stockquantity, supplierid ?? null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'product not found'
            });
        }

        res.status(200).json({
            message: 'product updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'error updating product'
        });
    }
});
//---------------------------------------------------------------------------------
// delete a product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM Products WHERE productid = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'product not found'
            });
        }

        res.status(200).json({
            message: 'product deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'error deleting product'
        });
    }
});
//=====================================================================================================
//3. Create REST API endpoints to perform CRUD operations for the Suppliers table:
//1.create a supplier
app.post('/suppliers', async (req, res) => {
    try {
        const { suppliername, contactnumber } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO Suppliers (suppliername, contactnumber)
VALUES (?, ?)`,
            [suppliername, contactnumber]
        );

        res.status(201).json({
            message: 'supplier added successfully',
            supplierid: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: 'error creating supplier'
        });
    }
});
//------------------------------------------------------------------------------
//2.get all suppliers
app.get('/suppliers', async (req, res) => {
    try {
        const [result] = await pool.execute(
            'SELECT * FROM Suppliers'
        );

        res.status(200).json(result);

    } catch (e) {
        res.status(500).json({
            message: 'error getting suppliers'
        });
    }
});
//---------------------------------------------------------------------------------------
//3.updating suppliers
app.put('/suppliers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { suppliername, contactnumber } = req.body;

        const [result] = await pool.execute(
            `UPDATE Suppliers
SET suppliername = ?, contactnumber = ?
WHERE supplierid = ?`,
            [suppliername, contactnumber, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'supplier not found'
            });
        }

        const [suppliers] = await pool.execute(
            'SELECT * FROM Suppliers WHERE supplierid = ?',
            [id]
        );

        res.status(200).json({
            message: 'supplier updated successfully',
            supplier: suppliers[0]
        });

    } catch (e) {
        res.status(500).json({
            message: 'error updating supplier'
        });
    }
});
//---------------------------------------------------------------------------------------
app.delete('/suppliers/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            `DELETE FROM Suppliers
            WHERE supplierid = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'supplier not found'
            });
        }

        res.status(200).json({
            message: 'supplier deleted successfully'
        });

    } catch (e) {
        res.status(500).json({
            message: 'error deleting supplier'
        });
    }
});
//===============================================================================================
//5. Create API endpoints to perform the following database modifications:
// 1. Add Category column to Products
app.post('/products/add-category', async (req, res) => {
    try {
        await pool.execute(
            'ALTER TABLE Products ADD COLUMN Category VARCHAR(100)'
        );

        res.status(200).json({
            message: 'category column added successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'error adding category column'
        });
    }
});
//---------------------------------------------------------------------------------------
// 2. Remove Category column from Products
app.delete('/products/remove-category', async (req, res) => {
    try {
        await pool.execute(
            'ALTER TABLE Products DROP COLUMN Category'
        );

        res.status(200).json({
            message: 'category column removed successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'error removing category column'
        });
    }
});
//---------------------------------------------------------------------------------------
// 3. Change ContactNumber to VARCHAR(15)
app.put('/suppliers/change-contactnumber', async (req, res) => {
    try {
        await pool.execute(
            'ALTER TABLE Suppliers MODIFY COLUMN contactnumber VARCHAR(15)'
        );

        res.status(200).json({
            message: 'contactnumber changed to varchar(15) successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'error changing contactnumber'
        });
    }
});
//---------------------------------------------------------------------------------------
// 4. Add NOT NULL constraint to ProductName
app.put('/products/productname-not-null', async (req, res) => {
    try {
        await pool.execute(
            'ALTER TABLE Products MODIFY COLUMN productname VARCHAR(250) NOT NULL'
        );

        res.status(200).json({
            message: 'productname changed to not null successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'error changing productname constraint'
        });
    }
});
//===============================================================================================
// 6. Create an API endpoint or initialization script to insert the following data:( 1.5 Grade)
// a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'.
app.post('/initilzed-data', async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [supplierresult] = await connection.execute(
            `INSERT INTO Suppliers (suppliername, contactnumber)
            VALUES (?, ?)`,
            ['freshfoods', '01001234567']
        );

        const supplierid = supplierresult.insertId;

        const [milkresult] = await connection.execute(
            `INSERT INTO Products (productname, price, stockquantity, supplierid)
            VALUES (?, ?, ?, ?)`,
            ['milk', 15.00, 50, supplierid]
        );

        const [breadresult] = await connection.execute(
            'INSERT INTO Products (productname, price, stockquantity, supplierid) VALUES (?, ?, ?, ?)',
            ['Bread', 10.00, 30, supplierid]
        );

        const [eggresult] = await connection.execute(
            'INSERT INTO Products (productname, price, stockquantity, supplierid) VALUES (?, ?, ?, ?)',
            ['Eggs', 20.00, 40, supplierid]
        );

        const [saleresult] = await connection.execute(
            'INSERT INTO Sales (productid, quantitysold, saledate) VALUES (?, ?, ?)',
            [milkresult.insertId, 2, '2025-05-20']
        );

        await connection.commit();

        res.status(200).json({
            message: 'data added successfully'
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error(error);

        res.status(500).json({
            message: 'error adding data'
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});
//---------------------------------------------------------------------------------------
// 8. Delete the product Eggs
app.delete('/products/eggs', async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM Products WHERE productname = ?',
            ['Eggs']
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'product not found'
            });
        }

        res.status(200).json({
            message: 'eggs deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'error deleting product'
        });
    }
});

//------------------------------------------------------------------------
// 9. Get total quantity sold for each product
app.get('/reports/total-sales', async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT Products.productid, Products.productname,
                    SUM(Sales.quantitysold) AS totalquantitysold
             FROM Products
             LEFT JOIN Sales ON Products.productid = Sales.productid
             GROUP BY Products.productid, Products.productname`
        );

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'error getting total quantity sold'
        });
    }
});
//---------------------------------------------------------------------------------------
// 10. Get product with the highest stock quantity
app.get('/reports/highest-stock', async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT * FROM Products
             ORDER BY stockquantity DESC
             LIMIT 1`
        );

        if (result.length === 0) {
            return res.status(404).json({
                message: 'no products found'
            });
        }

        res.status(200).json(result[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'error getting product with highest stock'
        });
    }
});
//----------------------------------------------------------------------------------------------
// 11. Get suppliers whose names start with F
app.get('/reports/suppliers-starting-with-f', async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT * FROM Suppliers
             WHERE suppliername LIKE 'F%'`
        );

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'error getting suppliers'
        });
    }
});
//----------------------------------------------------------------------------------------------
// 12. Get products that have never been sold
app.get('/reports/unsold-products', async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT Products.*
             FROM Products
             LEFT JOIN Sales ON Products.productid = Sales.productid
             WHERE Sales.productid IS NULL`
        );

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'error getting unsold products'
        });
    }
});

//----------------------------------------------------------------------------------------------
// 13. Get all sales with product name, quantity sold, and sale date
app.get('/reports/sales', async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT Products.productname, Sales.quantitysold, Sales.saledate
             FROM Sales
             INNER JOIN Products
             ON Sales.productid = Products.productid`
        );

        res.status(200).json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'error getting sales'
        });
    }
});
//----------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------

app.listen(3000, () => {
    console.log('server started on port 3000')
})