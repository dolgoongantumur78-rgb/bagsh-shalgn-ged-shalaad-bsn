import { useState } from "react";
import useTodo from "./hooks/useTodo";

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodo();
  const [text, setText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    addTodo(text);
    setText("");
  };

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div className="max-w-md mx-auto my-10 font-sans px-4">
      <h1 className="text-3xl font-bold text-white mb-6">Todo App</h1>

      <form onSubmit={onSubmit} className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo..."
          className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </form>

      <div className="flex justify-between items-center mb-4 text-gray-300">
        <span>
          Total: {todos.length} | Done: {doneCount}
        </span>
        <button 
          onClick={clearCompleted} 
          disabled={doneCount === 0}
          className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear done
        </button>
      </div>

      <ul className="list-none p-0 mt-4 space-y-2">
        {todos.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <label className="flex items-center gap-3 flex-1 cursor-pointer">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTodo(t.id)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className={t.done ? "line-through text-gray-500" : "text-gray-200"}>
                {t.text}
              </span>
            </label>

            <button 
              onClick={() => deleteTodo(t.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="text-gray-500 text-center mt-8">No todos yet.</p>}
    </div>
  );
}