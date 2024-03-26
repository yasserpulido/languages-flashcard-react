import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen h-full flex flex-col p-4 sm:w-2/5 w-full m-auto">
      <main className="flex flex-col justify-center items-center h-full">
        <Outlet />
      </main>
      <footer className="mt-auto">
        <p className="text-gray-500 text-sm text-center">
          Developed with ❤ by{" "}
          <a href="https://yasserpulido.com/" target="_blank" rel="noreferrer">
            <span className="hover:text-gray-600">Yasser Pulido</span>
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
