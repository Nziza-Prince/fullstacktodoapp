const express = require("express");
const router = express.Router();
const pool = require("./database/databaseConn");

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET all todos for a specific user
router.get("/:userId/todos", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User or todos not found" });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't fetch todos" });
  }
});

// GET a specific todo by ID for a specific user
router.get("/:userId/todos/:todoId", async (req, res) => {
  const { userId, todoId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1 AND id = $2", [userId, todoId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't fetch the todo" });
  }
});

// POST a new todo for a specific user
router.post("/:userId/todos", async (req, res) => {
  const { userId } = req.params;
  const { title, completed = false } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO todos (user_id, title, completed) VALUES ($1, $2, $3) RETURNING *",
      [userId, title, completed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't create the todo" });
  }
});

// PATCH (update) a specific todo by ID for a specific user
router.put("/:userId/todos/:todoId", async (req, res) => {
  const { userId, todoId } = req.params;
  const { title, completed } = req.body;

  try {
    const query = `
      UPDATE todos
      SET title = COALESCE($1, title), completed = COALESCE($2, completed)
      WHERE user_id = $3 AND id = $4
      RETURNING *`;
    const result = await pool.query(query, [title, completed, userId, todoId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't update the todo" });
  }
});

// DELETE all completed todos for a specific user
router.delete("/:userId/todos/status/completed", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE user_id = $1 AND completed = TRUE RETURNING *",
      [userId]
    );
    res.json({ message: "Completed todos deleted", deleted: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't delete completed todos" });
  }
});

// DELETE a specific todo by ID for a specific user
router.delete("/:userId/todos/:todoId", async (req, res) => {
  const { userId, todoId } = req.params;

  try {
    const result = await pool.query("DELETE FROM todos WHERE user_id = $1 AND id = $2 RETURNING *", [userId, todoId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully", deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't delete the todo" });
  }
});

// GET all incomplete todos for a specific user
router.get("/:userId/todos/status/incomplete", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1 AND completed = FALSE", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't fetch incomplete todos" });
  }
});

// GET all complete todos for a specific user
router.get("/:userId/todos/status/complete", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1 AND completed = TRUE", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't fetch complete todos" });
  }
});

router.patch("/:userId/todos/status/un-complete-all",async(req,res) => {
  const {userId} = req.params
  try{
    const result = await pool.query("update todos set completed = false where user_id = $1 and completed = true returning *",[userId])
    res.json({message:"All todos marked as incomplete",update:result.rows})
  }catch(err){
    console.error(err.getMessage())
    res.status(500).json({message:"Couldnt update the status"})
  }
})
module.exports = router;
