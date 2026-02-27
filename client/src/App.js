import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const API_URL = "https://task-tracker-backend-lcd3.onrender.com/api/tasks";
// const API_URL = "http://localhost:5000/api/tasks";

const taskSchema = yup.object().shape({
  title: yup.string().required('Task title is required').min(1, 'Task title cannot be empty')
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(taskSchema)
  });

  const fetchTasks = () => {
    setLoading(true);
    setError(null);
    axios.get(API_URL)
      .then((res) => setTasks(res.data))
      .catch((err) => setError(err.message || 'Failed to load tasks'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const taskId = (task) => task._id ?? task.id;

  const createTask = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(API_URL, { title: data.title });
      setTasks([response.data, ...tasks]);
      reset();
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTaskCompletion = async (task) => {
    try {
      const response = await axios.put(`${API_URL}/${taskId(task)}`, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => taskId(t) === taskId(task) ? response.data : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (task) => {
    try {
      await axios.delete(`${API_URL}/${taskId(task)}`);
      setTasks(tasks.filter(t => taskId(t) !== taskId(task)));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const updateTask = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`${API_URL}/${taskId(editingTask)}`, {
        ...editingTask,
        title: data.title
      });
      setTasks(tasks.map(t => taskId(t) === taskId(editingTask) ? response.data : t));
      setEditingTask(null);
      reset();
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-tracker">
      <header className="task-tracker__header">
        <h1 className="task-tracker__title">Task Tracker</h1>
        <p className="task-tracker__subtitle">Stay focused, get things done</p>
      </header>

      <main className="task-tracker__main">
        {/* Task Form */}
        <div className="task-form">
          <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          <form onSubmit={handleSubmit(editingTask ? updateTask : createTask)}>
            <div className="form-group">
              <input
                type="text"
                placeholder={editingTask ? editingTask.title : "Enter task title..."}
                {...register('title')}
                className="form-input"
                defaultValue={editingTask ? editingTask.title : ''}
              />
              {errors.title && <span className="error-message">{errors.title.message}</span>}
            </div>
            <div className="form-actions">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Saving...' : (editingTask ? 'Update' : 'Add')}
              </button>
              {editingTask && (
                <button type="button" onClick={cancelEditing} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
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
                <button
                  onClick={() => toggleTaskCompletion(task)}
                  className={`task-item__status ${task.completed ? 'task-item__status--done' : ''}`}
                  aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {task.completed ? '✓' : '○'}
                </button>
                <span className={`task-item__title ${task.completed ? 'task-item__title--done' : ''}`}>
                  {task.title}
                </span>
                <div className="task-item__actions">
                  <button
                    onClick={() => startEditing(task)}
                    className="btn btn-edit"
                    aria-label="Edit task"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTask(task)}
                    className="btn btn-delete"
                    aria-label="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
