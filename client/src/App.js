import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://task-tracker-backend-lcd3.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(API_URL)
      .then((res) => setTasks(res.data))
      .catch((err) => setError(err.message || 'Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const taskId = (task) => task._id ?? task.id;

  return (
    <div className="task-tracker">
      <header className="task-tracker__header">
        <h1 className="task-tracker__title">Task Tracker</h1>
        <p className="task-tracker__subtitle">Stay focused, get things done</p>
      </header>

      <main className="task-tracker__main">
        {loading && (
          <div className="task-tracker__loading" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <span>Loading tasks...</span>
          </div>
        )}

        {error && (
          <div className="task-tracker__error" role="alert">
            <span className="task-tracker__error-icon" aria-hidden="true">⚠</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="task-tracker__empty">
            <span className="task-tracker__empty-icon" aria-hidden="true">📋</span>
            <p>No tasks yet</p>
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <ul className="task-list" role="list">
            {tasks.map((task) => (
              <li key={taskId(task)} className="task-item">
                <span className={`task-item__status ${task.completed ? 'task-item__status--done' : ''}`} aria-hidden="true">
                  {task.completed ? '✓' : '○'}
                </span>
                <span className={`task-item__title ${task.completed ? 'task-item__title--done' : ''}`}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
