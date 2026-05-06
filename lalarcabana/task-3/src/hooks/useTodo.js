import useLocalStorage from "./useLocalStorage";

export default function useTodo(storageKey = "todos") {
  const [todos, setTodos] = useLocalStorage(storageKey, []);

  const addTodo = (text) => {
    const title = text.trim();
    if (!title) return;

    const newTodo = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text: title,
      done: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  return { todos, addTodo, toggleTodo, deleteTodo, clearCompleted };
}
