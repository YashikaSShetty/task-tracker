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

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
