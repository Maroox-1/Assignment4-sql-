CREATE TABLE Products (
    productid int PRIMARY KEY AUTO_INCREMENT ,
    productname varchar(250) ,
    price decimal( 10 , 2) ,
    stockquantity INT ,
    supplierid int REFERENCES Suplieers(supplierid)
)

CREATE TABLE Suplieers (
    supplierid int PRIMARY KEY AUTO_INCREMENT ,
    suppliername varchar(250) ,
    contactnumber varchar(11)
)

CREATE TABLE sales (
    saleid          int PRIMARY KEY AUTO_INCREMENT ,
    productid       int REFERENCES Products(productid) ,
    quantitysold    int ,
    saledate date()

)

---------------------------------------------------------------------------------------
