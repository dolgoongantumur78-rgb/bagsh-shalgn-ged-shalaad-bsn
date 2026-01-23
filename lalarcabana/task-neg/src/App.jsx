import useLocalStorage from "./hooks/uselocalstorage";

function App() {
  const [name, setName] = useLocalStorage("username", "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          useLocalStorage Task
        </h1>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 placeholder-gray-400"
        />
        <p className="text-gray-300 text-center">
          Saved name: <span className="font-semibold text-blue-400">{name || "None"}</span>
        </p>
      </div>
    </div>
  );
}

export default App;
