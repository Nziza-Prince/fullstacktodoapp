const express = require("express");
const router = express.Router();
const User = require("./models/usermodel");

// GET all todos for a specific user
router.get("/",async(req,res)=>{
  try{
   const users = await User.find()
   res.send(users)
  }catch(err){
    console.log(err)
  }
})

router.get("/:userId/todos", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user.todos);
  } catch (err) {
    res.status(500).send("Couldn't fetch todos");
  }
});

// GET a specific todo by ID for a specific user
router.get("/:userId/todos/:todoId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const todo = user.todos.id(req.params.todoId);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    res.send(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST a new todo for a specific user
router.post("/:userId/todos", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const newTodo = {
      title: req.body.title,
      completed: req.body.completed || false
    };
    user.todos.push(newTodo);
    await user.save();
    res.send(newTodo);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PATCH (update) a specific todo by ID for a specific user
router.put("/:userId/todos/:todoId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const todo = user.todos.id(req.params.todoId);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    if (req.body.title != null) {
      todo.title = req.body.title;
    }
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }
    await user.save();
    res.send(todo);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// DELETE a specific todo by ID for a specific user
router.delete("/:userId/todos/:todoId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const todo = user.todos.id(req.params.todoId);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    user.todos.pull(todo); // Remove the todo from the array
    await user.save();
    res.status(200).send(`Removed ${todo.title} successfully`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// GET all incomplete todos for a specific user
router.get("/:userId/todos/status/incomplete", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const incompleteTodos = user.todos.filter(todo => !todo.completed);
    res.send(incompleteTodos);
  } catch (err) {
    res.status(500).send("Couldn't fetch incomplete todos");
  }
});

// GET all complete todos for a specific user
router.get("/:userId/todos/status/complete", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const completeTodos = user.todos.filter(todo => todo.completed);
    res.send(completeTodos);
  } catch (err) {
    res.status(500).send("Couldn't fetch complete todos");
  }
});

module.exports = router;
