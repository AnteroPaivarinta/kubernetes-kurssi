import React, { useState, useEffect } from "react";
import axios from "axios";

//http://todo-app-svc:2347/page
const STORAGE_KEY = "todos";
const image_KEY = "";  //http://todo-backend-svc:2346   http://localhost:3003/todos" "http://localhost:3001/page";
const URL =  import.meta.env.VITE_URL_PAGE;
const URL_TODOS = import.meta.env.VITE_URL_TODOS;
const URL_TODOS_UPDATE = import.meta.env.VITE_URL_TODOS_UPDATE

function App() {
  

  const [todos, setTodos] = useState([]);
  const [image, setImage] = useState(() => {
    const saved = localStorage.getItem(image_KEY);
    return saved ? saved : "";
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await axios.get(URL);
        localStorage.setItem(image_KEY, response.data.url);
        setImage(response.data.url);
        return response.data.url;
      } catch (error) {
        console.error("Virhe haettaessa Image:", error);
        throw error;
      }
    }
    async function fetchTodos() {
      try {
        const response = await axios.get(URL_TODOS);
        setTodos(response.data.todos);
      } catch (error) {
        console.error("Virhe haettaessa todos:", error);
        throw error;
      }
    }
    
    fetchImage();
    fetchTodos();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const value = input.trim();
    if (value && value.length <= 140) {
      onClickAdd(value);
      setInput("");
    }
  };

  const onClickAdd = async(todo) => {
    try {
      const response = await axios.post(URL_TODOS, {
        item: todo,
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Virhe tallennuksessa:", error);
    }
  }

  const onClickUpdate  = async(todo) => {
    
    const update_url = `${URL_TODOS_UPDATE}${todo.id}`
    try {
      const response = await axios.put(update_url,{
        item: todo,
      });
      setTodos(response.data.todos);
    } catch (error) {
      console.error("Virhe tallennuksessa:", error);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Hello World!</h1>
      <p>Tämä on yksinkertainen React-vastaus.</p>
      <img src={localStorage.getItem(image_KEY)} alt="Satunnainen kuva" style={{ marginBottom: "20px" }} />
      
      <h1>Todo</h1>
      <ul>
        {todos
          .filter(todo => todo.status !== "done") 
          .map((todo, index) => (
            <li key={index}>{todo.item} <button onClick={() => onClickUpdate(todo)}> Mark as read </button></li> 
        ))}
      </ul>
      <h1>Done</h1>
      <ul>
        {todos
          .filter(todo => todo.status === "done") 
          .map((todo, index) => (
            <li key={index}>{todo.item}</li> 
        ))}
      </ul>

      <form onSubmit={handleSubmit} style={{ marginTop: "10px"}}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={140}
          placeholder="Write a todo"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
