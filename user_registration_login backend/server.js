const express = require("express");
const db = require("./db/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
require("dotenv").config();  

const app = express();


app.use(cors());
app.use(express.json());  


db.getConnection((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL database!");
});


app.use("/auth", authRoutes);


const PORT = 5000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
