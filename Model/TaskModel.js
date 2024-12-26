const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
