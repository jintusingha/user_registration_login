const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
require("dotenv").config();  

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO registration (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        throw err;
      }
      res.status(201).json({ message: "User registered successfully!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
   
    const query = "SELECT * FROM registration WHERE email = ?";
    db.query(query, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      
      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = result[0];

     
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET_KEY,  
        { expiresIn: '1h' }  
      );

      res.status(200).json({ message: "Login successful", token });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});


router.get("/users", (req, res) => {
  const query = "SELECT id, name, email, created_at FROM registration";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching users", error: err });
    }
    res.status(200).json({ users: results });
  });
});

module.exports = router;
