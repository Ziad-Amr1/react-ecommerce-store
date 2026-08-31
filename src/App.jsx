import DesignSystem from "./pages/DesignSystem";
import Home from "./pages/Home.jsx";
import { Routes, Route } from "react-router";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/desgin-system" element={<DesignSystem />} />
    </Routes>
  );
}

export default App;