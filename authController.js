const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const hashed = bcrypt.hashSync(password, 10);

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, existingUsers) => {
    if (err) return res.status(500).json({ message: "Registration failed", error: err.message });
    if (existingUsers.length > 0) return res.status(409).json({ message: "Email already registered" });

    db.query("INSERT INTO users(name, email, password) VALUES(?, ?, ?)", [name, email, hashed], (insertErr) => {
      if (insertErr) return res.status(500).json({ message: "Registration failed", error: insertErr.message });
      res.status(201).json({ message: "Registration successful" });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Login failed", error: err.message });
    if (!result || result.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result[0];
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "taskflow-secret", { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
};