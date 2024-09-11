const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    todos: {
        type: [TodoSchema],  // This is an array of TodoSchema objects
        default: []
    }
});

module.exports = mongoose.model("User", UserSchema);
