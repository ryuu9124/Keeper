const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)"
  );
});

// Routes
app.get("/notes", (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ notes: rows });
  });
});

app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM notes WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
