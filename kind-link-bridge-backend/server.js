const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite database setup
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error("❌ Error opening database:", err);
  } else {
    console.log("✅ Connected to SQLite database.");
    db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount REAL,
      date TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS volunteer_hours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      hours INTEGER,
      date TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS user_causes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      cause_name TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
  );
});

  }
});

// Signup API
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, password],
    function (err) {
      if (err) {
        return res.status(400).json({ error: "⚠️ Email already exists" });
      }
      res.json({ id: this.lastID, username, email });
    }
  );
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "⚠️ Internal server error" });
      }
      if (!row) {
        return res.status(400).json({ error: "❌ Invalid credentials" });
      }
      res.json({ id: row.id, username: row.username, email: row.email });
    }
  );
});

//Donation
app.post("/donations", (req, res) => {
  const { user_id, amount } = req.body;
  const date = new Date().toISOString();

  db.run(
    `INSERT INTO donations (user_id, amount, date) VALUES (?, ?, ?)`,
    [user_id, amount, date],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to add donation" });
      res.json({ id: this.lastID, user_id, amount, date });
    }
  );
});

//Volunteer Hours
app.post("/volunteer", (req, res) => {
  const { user_id, hours } = req.body;
  const date = new Date().toISOString();

  db.run(
    `INSERT INTO volunteer_hours (user_id, hours, date) VALUES (?, ?, ?)`,
    [user_id, hours, date],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to log hours" });
      res.json({ id: this.lastID, user_id, hours, date });
    }
  );
});

//Cause Support
app.post("/causes", (req, res) => {
  const { user_id, cause_name } = req.body;

  db.run(
    `INSERT INTO user_causes (user_id, cause_name) VALUES (?, ?)`,
    [user_id, cause_name],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to support cause" });
      res.json({ id: this.lastID, user_id, cause_name });
    }
  );
});

app.get("/dashboard/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.serialize(() => {
    db.get(
      `SELECT username, email FROM users WHERE id = ?`,
      [user_id],
      (err, user) => {
        if (err || !user) return res.status(404).json({ error: "User not found" });

        db.get(
          `SELECT SUM(amount) as total_donations FROM donations WHERE user_id = ?`,
          [user_id],
          (err, donation) => {
            db.get(
              `SELECT SUM(hours) as total_hours FROM volunteer_hours WHERE user_id = ?`,
              [user_id],
              (err, hours) => {
                db.all(
                  `SELECT cause_name FROM user_causes WHERE user_id = ?`,
                  [user_id],
                  (err, causes) => {
                    res.json({
                      user,
                      total_donations: donation?.total_donations || 0,
                      total_hours: hours?.total_hours || 0,
                      causes: causes.map((c) => c.cause_name),
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
