import connection from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Register
export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "email and password is required" });
    }

    const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUsers] = await connection.query(emailCheckQuery, [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery =
      "INSERT INTO users ( email,password, username) VALUES (?, ?, ?)";
    const result = await connection.query(insertQuery, [
      email,
      hashedPassword,
      username,
    ]);

    const userId = result.insertId;

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Login API
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUsers] = await connection.query(emailCheckQuery, [email]);

    if (existingUsers.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = existingUsers[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const payload = {
      username: user.name,
      userId: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res
      .status(200)
      .json({ message: `${user.email} Login Successfully`, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};
