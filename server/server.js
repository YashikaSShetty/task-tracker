const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const tasks = [
  { id: 1, title: "Learn Node", completed: false },
  { id: 2, title: "Build Task Tracker", completed: false }
];

//get
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

//post added
app.post  ('/api/tasks', (req, res) => {
  const {title} = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  const newTask = {
    id: tasks.length + 1,
    title,
    isCompleted: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
})

//delete added
app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const taskIndex = tasks.findIndex(task => task.id === parseInt(id)); 
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  tasks.splice(taskIndex, 1);
  return res.status(204).send();  // Respond with 204 No Content to indicate successful deletion
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
