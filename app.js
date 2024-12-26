const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3004',  // Specify the allowed origin
  methods: 'GET,POST',              // Allow only specific HTTP methods (optional)
  allowedHeaders: 'Content-Type',   // Specify allowed headers (optional)
};




const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const Task = require("./Model/TaskModel");

const MONGODB_URI =
  "mongodb+srv://bittukarthik77:HvFT7s9rQd0Kl4Tn@cluster0.r6dj3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Start the server
app.listen(4000, () => console.log(`Server Running At http://localhost:4000`));

//posting task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Fetch all tasks
app.get("/tasks", async (request, response) => {
  try {
    const tasks = await Task.find(); // Correct method to fetch all tasks
    response.status(200).send(tasks);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

app.delete("/tasks/:id",async(request,response)=>{
  const {id} = request.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return response.status(404).send({ error: "Task Not found" });
    }
    response.status(200).send({ message: "Task Deleted Successfully" });
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
})


// Update task route
app.patch('/tasks/:id', async (request, response) => {
  const { id } = request.params;
  const { name, description, dueDate, status, priority } = request.body;

  try {
    // Find the task by ID and update it with the provided details
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        name,
        description,
        dueDate,
        status,
        priority,
      },
      { new: true }  // This returns the updated task after modification
    );

    if (!updatedTask) {
      return response.status(404).json({ message: 'Task not found' });
    }

    response.json(updatedTask);  // Return the updated task
  } catch (error) {
    response.status(500).json({ message: 'Error updating task', error });
  }
});


