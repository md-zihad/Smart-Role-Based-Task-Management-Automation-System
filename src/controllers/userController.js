const db = require("../config/db");
const jwt = require("jsonwebtoken");

const getAllUser = async (req, res) => {
  try {
    const result = await db.query(
      `
            SELECT u.id, u.username, u.email, r.name AS role
            FROM users u
            LEFT JOIN roles r on u.role_id = r.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to fetch users" });
  }
};

const createUser = async (req, res) => {
  const { username, email, password, role_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO users (username, email, password, role_id)
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, role_id`,
      [username, email, password, role_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to create user", detail: err.message });
  }
};

const signupUser = async (req, res) => {
  const { username, email, password, role_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `
          INSERT INTO users (username, email, password, role_id)
          VALUES ($1, $2, $3, $4) RETURNING id, username, email, role_id`,
      [username, email, hashedPassword, role_id]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "signup failed", detail: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed", detail: err.message });
  }
};

module.exports = { getAllUser, createUser, signupUser, loginUser };
