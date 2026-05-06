import { useState } from "react";
import useDebounce from "./hooks/useDebounce";

function App() {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 1000);

  return (
    <div>
      <h1>useDebounce Task</h1>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type here..."
      />

      <p>Instant value: {text}</p>
      <p>Debounced value: {debouncedText}</p>
    </div>
  );
}

export default App;