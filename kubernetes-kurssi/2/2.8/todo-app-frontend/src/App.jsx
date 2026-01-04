import React, { useState, useEffect } from "react";
import axios from "axios";

//http://todo-app-svc:2347/page
const STORAGE_KEY = "todos";
const image_KEY = "";  //http://todo-backend-svc:2346   http://localhost:3003/todos" "http://localhost:3001/page";
const URL =  import.meta.env.VITE_URL_PAGE;
const URL_TODOS = import.meta.env.VITE_URL_TODOS;



function App() {
  // LocalStoragesta haetaan alustus

  const [todos, setTodos] = useState([]);
  const [image, setImage] = useState(() => {
    const saved = localStorage.getItem(image_KEY);
    return saved ? saved : "";
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    console.log(URL, URL_TODOS)
    async function fetchImage() {
      try {
        const response = await axios.get(URL);
        localStorage.setItem(image_KEY, response.data.url);
        setImage(response.data.url);
        return response.data.url;
      } catch (error) {
        console.error("Virhe haettaessa todos:", error);
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
      console.log("RESPONSE", response.data);
      setTodos(response.data);
    } catch (error) {
      console.error("Virhe tallennuksessa:", error);
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Hello World!</h1>
      <p>Tämä on yksinkertainen React-vastaus.</p>
      <img src={localStorage.getItem(image_KEY)} alt="Satunnainen kuva" style={{ marginBottom: "20px" }} />

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
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
