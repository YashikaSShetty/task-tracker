// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks,setTasks]=useState([]);
  useEffect(() => {
    axios.get("https://task-tracker-backend-lcd3.onrender.com/api/tasks")
    .then((res)=>{setTasks(res.data)})
    .catch((err)=>{console.log(err)});
  },[]);
  return (
    <div style={{padding:"20px"}}>
      <h2>Task Tracker</h2>
      <ul>
        {tasks.map((task)=>
        <li key={task._id}> 
          {task.title} - {task.completed ? "✅" : "❌"} 
        </li>)}
      </ul>
    </div>
/*     <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div> */
  );
}

export default App;
