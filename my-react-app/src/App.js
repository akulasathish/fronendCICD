import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const handleInputChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    if (task) {
      setTasks([...tasks, task]);
      setTask(''); // Clear the input after adding the task
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Tracker App</h1>
        <h2>Created by Sathish Akula!</h2>
        <p>Keep track of your tasks easily!</p>

        <div>
          <input 
            type="text" 
            value={task} 
            onChange={handleInputChange} 
            placeholder="Add a new task" 
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>

        <ul>
          {tasks.map((t, index) => (
            <li key={index}>{t}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
