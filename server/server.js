require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

// Temporarily disable MongoDB for testing
// const mongoose = require('mongoose');
// const connectDB = require('./config/database');
// const { sendEndOfDayEmail } = require('./services/emailService');
// const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

// Temporarily use in-memory storage for testing
let tasks = [
  { _id: '1', title: "Learn Node", completed: false, createdAt: new Date(), updatedAt: new Date() },
  { _id: '2', title: "Build Task Tracker", completed: false, createdAt: new Date(), updatedAt: new Date() }
];

// Connect to database (commented out for testing)
// connectDB();

app.use(cors());
app.use(express.json());

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST create new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const newTask = {
      _id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.unshift(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    console.log('PUT request - Looking for task with ID:', id);
    console.log('Current tasks:', tasks.map(t => ({ _id: t._id, title: t.title })));
    
    const taskIndex = tasks.findIndex(task => task._id === id || task.id === id);
    if (taskIndex === -1) {
      console.log('Task not found for ID:', id);
      return res.status(404).json({ message: 'Task not found' });
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      completed: completed !== undefined ? completed : tasks[taskIndex].completed,
      updatedAt: new Date()
    };
    
    console.log('Task updated successfully:', tasks[taskIndex]);
    res.json(tasks[taskIndex]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task._id === id || task.id === id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// Schedule end-of-day email at 6 PM every day (commented out for testing)
// cron.schedule('0 18 * * *', () => {
//   console.log('Running end-of-day email job...');
//   sendEndOfDayEmail();
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('End-of-day emails disabled for testing');
});
