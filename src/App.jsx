import DesignSystem from "./pages/DesignSystem";
import Home from "./pages/Home.jsx";
import { Routes, Route } from "react-router";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/desgin-system" element={<DesignSystem />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
}

export default App;
