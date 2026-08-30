import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <nav>Expense Tracker</nav>

      <Outlet />

      <footer>© 2026</footer>
    </>
  );
}

export default App;
