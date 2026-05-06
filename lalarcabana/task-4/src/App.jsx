import useToggle from "./hooks/useToggle";

function App() {
  const { value, toggle } = useToggle(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          useToggle Task
        </h1>
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Status:</p>
          <p className={`text-2xl font-semibold text-center py-3 rounded-lg ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {value ? "TRUE" : "FALSE"}
          </p>
        </div>
        <button
          onClick={toggle}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Toggle
        </button>
      </div>
    </div>
  );
}

export default App;