


const mysql=require("mysql2");


const db=mysql.createPool({


    host:"localhost",
    user:"root",
    password:"Jintu@28",
    database:"userregistraionlogin",
})


module.exports=db;